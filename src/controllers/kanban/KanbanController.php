<?php

namespace Controller\kanban;

use Repository\KanbansRepo;
use Repository\KanbansStatussenRepo;
use Repository\KanbansTakenRepo;
use Repository\UsersRepo;
use Tigress\Controller;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

/**
 * Class KanbanController (PHP version 8.4)
 *
 * @author Rudy Mas <rudy.mas@rudymas.be>
 * @copyright 2025 Rudy Mas (https://rudymas.be)
 * @license https://opensource.org/licenses/GPL-3.0 GNU General Public License, version 3 (GPL-3.0)
 * @version 2025.06.24.0
 * @package Controller\KanbanController
 */
class KanbanController extends Controller
{
    /**
     * @throws LoaderError
     */
    public function __construct()
    {
        TWIG->addPath('vendor/tigress/kanban-board/src/views');
    }

    /**
     * Home page
     *
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function index(): void
    {
        if (RIGHTS->checkRights() === false) {
            $_SESSION['redirect_after_login'] = $_SERVER['REQUEST_URI'];
            TWIG->redirect('/login');
        }

        TWIG->render('kanban/index.twig');
    }

    /**
     * Edit kanban taak
     *
     * @param array $args
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function editTaak(array $args): void
    {
        SECURITY->checkAccess();
        SECURITY->checkReferer(['/kanban/bord/*']);
        $this->checkRights();

        $kanbansTaken = new KanbansTakenRepo();
        $kanbansTaken->loadById($args['id']);
        if ($kanbansTaken->isEmpty()) {
            $kanbansTaken->new();
        }
        $kanbansTaak = $kanbansTaken->current();

        $kanbans = new KanbansRepo();
        $kanbans->loadById($args['kanban_id']);
        $kanban = $kanbans->current();

        $kanbansStatussen = new KanbansStatussenRepo();

        $users = new UsersRepo();

        TWIG->render('kanban/edit_kanban_taak.twig', [
            'kanbansTaak' => $kanbansTaak,
            'kanban' => $kanban,
            'kanbansStatusOptions' => $kanbansStatussen->getSelectOptions($kanbansTaak->kanban_status_id),
            'selectOptiesWorkers' => $users->getSelectOptionsWorkers(
                json_decode($kanbansTaak->worker_ids, true),
                json_decode($kanban->team_member_ids, true)
            ),
        ]);
    }

    /**
     * Edit kanban
     *
     * @param array $args
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function editKanban(array $args): void
    {
        $this->checkRights();

        $kanbans = new KanbansRepo();
        $kanbans->loadById($args['id']);
        if ($kanbans->isEmpty()) {
            $kanbans->new();
        }
        $kanban = $kanbans->current();
        $tegelLijst = $kanbans->getTegelLijst();

        if ($kanban->id === 0) {
            $kanban->product_owner_ids = '["' . $_SESSION['user']['id'] . '"]';
        }

        $users = new UsersRepo();

        TWIG->render('kanban/edit_kanban.twig', [
            'kanban' => $kanban,
            'selectOptiesProductOwners' => $users->getSelectOptions(json_decode($kanban->product_owner_ids, true)),
            'selectOptiesTeamMembers' => $users->getSelectOptions(json_decode($kanban->team_member_ids, true)),
            'tegelLijst' => $tegelLijst,
        ]);
    }

    /**
     * Kanban informatie taak
     *
     * @param array $args
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function informatieTaak(array $args): void
    {
        $this->checkRights();

        $kanbansTaken = new KanbansTakenRepo();
        $kanbansTaken->loadById($args['id']);
        $kanbansTaak = $kanbansTaken->current();

        $kanbans = new KanbansRepo();
        $kanbans->loadById($kanbansTaak->kanban_id);
        $kanban = $kanbans->current();

        $users = new UsersRepo();
        $kanbansStatussen = new KanbansStatussenRepo();

        TWIG->render('kanban/informatie_taak.twig', [
            'kanbansTaak' => $kanbansTaak,
            'kanban' => $kanban,
            'users' => $users,
            'kanbansStatussen' => $kanbansStatussen,
            'statussen' => [
                0 => 'Niet gestart',
                1 => 'Voorbereiding',
                2 => 'Ontwikkeling',
                3 => 'Testfase',
                4 => 'Afgerond',
                5 => 'In de wacht',
            ],
            'prioriteiten' => [
                1 => 'ASAP',
                2 => 'Prio 1',
                3 => 'Prio 2',
                4 => 'Prio 3',
                5 => 'Normaal',
                6 => 'Tussendoor 1',
                7 => 'Tussendoor 2',
                8 => 'Tussendoor 3',
                9 => 'Niet dringend',
            ],
        ]);
    }

    /**
     * Kanban bord
     *
     * @param array $args
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function bord(array $args): void
    {
        SECURITY->checkAccess();
        $this->checkRights();

        $kanbansStatussen = new KanbansStatussenRepo();
        $kanbansStatussen->loadAllActive('sort');

        $kanbans = new KanbansRepo();
        $kanbans->loadById($args['id']);

        $kanbansTaken = new KanbansTakenRepo();
        $kanbansTaken->loadByWhere([
            'kanban_id' => $args['id'],
            'active' => 1,
        ], 'deadline, prioriteit');

        $users = new UsersRepo();

        TWIG->render('kanban/kanban_bord.twig', [
            'kanbansStatussen' => $kanbansStatussen,
            'kanban' => $kanbans->current(),
            'kanbansTaken' => $kanbansTaken,
            'users' => $users,
        ]);
    }
}
