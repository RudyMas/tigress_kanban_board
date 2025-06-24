<?php

namespace Controller\kanban;

use Repository\KanbansRepo;
use Repository\KanbansStatusesRepo;
use Repository\KanbansTasksRepo;
use Repository\UsersRepo;
use Service\LocalizationService;
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

        TWIG->render('kanban/index.twig', [
            'statuses' => LocalizationService::getStatuses(CONFIG->website->html_lang),
        ]);
    }

    /**
     * Edit kanban task
     *
     * @param array $args
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function editTasks(array $args): void
    {
        SECURITY->checkAccess();
        SECURITY->checkReferer(['/kanban/board/*']);
        $this->checkRights();

        $kanbansTasks = new KanbansTasksRepo();
        $kanbansTasks->loadById($args['id']);
        if ($kanbansTasks->isEmpty()) {
            $kanbansTasks->new();
        }
        $kanbansTask = $kanbansTasks->current();

        $kanbans = new KanbansRepo();
        $kanbans->loadById($args['kanban_id']);
        $kanban = $kanbans->current();

        $kanbansStatuses = new KanbansStatusesRepo();

        $users = new UsersRepo();

        TWIG->render('kanban/edit_kanban_taak.twig', [
            'kanbansTask' => $kanbansTask,
            'kanban' => $kanban,
            'kanbansStatusOptions' => $kanbansStatuses->getSelectOptions($kanbansTask->kanban_status_id),
            'selectOptionsWorkers' => $users->getSelectOptionsWorkers(
                json_decode($kanbansTask->worker_ids, true),
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
        $tileList = $kanbans->getTegelLijst();

        if ($kanban->id === 0) {
            $kanban->product_owner_ids = '["' . $_SESSION['user']['id'] . '"]';
        }

        $users = new UsersRepo();

        TWIG->render('kanban/edit_kanban.twig', [
            'kanban' => $kanban,
            'selectOptionsProductOwners' => $users->getSelectOptions(json_decode($kanban->product_owner_ids, true)),
            'selectOptionsTeamMembers' => $users->getSelectOptions(json_decode($kanban->team_member_ids, true)),
            'tileLList' => $tileList,
        ]);
    }

    /**
     * Kanban information task
     *
     * @param array $args
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function informationTasks(array $args): void
    {
        $this->checkRights();

        $kanbansTasks = new KanbansTasksRepo();
        $kanbansTasks->loadById($args['id']);
        $kanbansTask = $kanbansTasks->current();

        $kanbans = new KanbansRepo();
        $kanbans->loadById($kanbansTask->kanban_id);
        $kanban = $kanbans->current();

        $users = new UsersRepo();
        $kanbansStatuses = new KanbansStatusesRepo();

        TWIG->render('kanban/informatie_taak.twig', [
            'kanbansTask' => $kanbansTask,
            'kanban' => $kanban,
            'users' => $users,
            'kanbansStatuses' => $kanbansStatuses,
            'statuses' => LocalizationService::getStatuses(CONFIG->website->html_lang),
            'priorities' => LocalizationService::getPriorities(CONFIG->website->html_lang),
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
    public function board(array $args): void
    {
        SECURITY->checkAccess();
        $this->checkRights();

        $kanbansStatuses = new KanbansStatusesRepo();
        $kanbansStatuses->loadAllActive('sort');

        $kanbans = new KanbansRepo();
        $kanbans->loadById($args['id']);

        $kanbansTasks = new KanbansTasksRepo();
        $kanbansTasks->loadByWhere([
            'kanban_id' => $args['id'],
            'active' => 1,
        ], 'deadline, priority');

        $users = new UsersRepo();

        TWIG->render('kanban/kanban_bord.twig', [
            'kanbansStatuses' => $kanbansStatuses,
            'kanban' => $kanbans->current(),
            'kanbansTasks' => $kanbansTasks,
            'users' => $users,
        ]);
    }
}
