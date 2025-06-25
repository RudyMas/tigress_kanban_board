<?php

namespace Controller\kanban;

use JetBrains\PhpStorm\NoReturn;
use Repository\KanbansRepo;
use Repository\KanbansTasksRepo;
use Tigress\Controller;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;

/**
 * Class KanbanCrudController (PHP version 8.4)
 *
 * @author Rudy Mas <rudy.mas@rudymas.be>
 * @copyright 2025 Rudy Mas (https://rudymas.be)
 * @license https://opensource.org/licenses/GPL-3.0 GNU General Public License, version 3 (GPL-3.0)
 * @version 2025.06.25.0
 * @package Controller\KanbanCrudController
 */
class KanbanCrudController extends Controller
{
    /**
     * Archive kanban
     *
     * @return void
     */
    #[NoReturn] public function archive(): void
    {
        $this->checkRights();

        $kanbans = new KanbansRepo();
        $kanbans->deleteById($_POST['id']);

        TWIG->redirect('/kanban');
    }

    /**
     * Get all active or inactive kanbans
     *
     * @param array $args
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function getAllByActive(array $args): void
    {
        if (RIGHTS->checkRights() === false) {
            TWIG->render(null, [], 'DT');
            exit;
        }

        $kanbans = new KanbansRepo();
        if ($args['active']) {
            if ($_SESSION['user']['access_level'] == 100) {
                $kanbans->loadAllActive();
            } else {
                $kanbans->loadByWhereQuery(
                    'active = 1 AND
                                (
                                    product_owner_ids LIKE \'%"' . $_SESSION['user']['id'] . '"%\'
                                    OR team_member_ids LIKE \'%"' . $_SESSION['user']['id'] . '"%\'
                                )'
                );
            }
        } else {
            if ($_SESSION['user']['access_level'] == 100) {
                $kanbans->loadAllInactive();
            } else {
                $kanbans->loadByWhereQuery(
                    'active = 0 AND
                                (
                                    product_owner_ids LIKE \'%"' . $_SESSION['user']['id'] . '"%\'
                                    OR team_member_ids LIKE \'%"' . $_SESSION['user']['id'] . '"%\'
                                )'
                );
            }
        }

        TWIG->render(null, $kanbans->toArray(), 'DT');
    }

    /**
     * Restore kanban
     *
     * @return void
     */
    #[NoReturn] public function restore(): void
    {
        $this->checkRights();

        $kanbans = new KanbansRepo();
        $kanbans->undeleteById($_POST['id']);

        TWIG->redirect('/kanban?show=archive');
    }

    /**
     * Delete task
     *
     * @return void
     */
    #[NoReturn] public function deleteTaak(): void
    {
        $this->checkRights();

        $kanbansTasks = new KanbansTasksRepo();
        $kanbansTasks->deleteById((int)$_POST['id']);

        TWIG->redirect('/kanban/board/' . $_POST['kanban_id']);
    }

    /**
     * Update status of a task
     *
     * @return void
     * @throws LoaderError
     * @throws RuntimeError
     * @throws SyntaxError
     */
    public function kanbanUpdateStatus(): void
    {
        $this->checkRights();

        $kanbansTasks = new KanbansTasksRepo();
        $kanbansTasks->loadById($_POST['id']);
        $kanbansTask = $kanbansTasks->current();
        $kanbansTask->kanban_status_id = (int)$_POST['status'];
        $kanbansTasks->save($kanbansTask);

        TWIG->render('', ['success' => true], 'JSON');
    }

    /**
     * Save kanban
     *
     * @return void
     */
    #[NoReturn] public function saveKanban(): void
    {
        $this->checkRights();

        $_POST['product_owner_ids'] = json_encode($_POST['product_owner_ids']);
        $_POST['team_member_ids'] = json_encode($_POST['team_member_ids']);

        $kanbans = new KanbansRepo();
        if (isset($_POST['id']) && $_POST['id'] > 0) {
            $kanbans->loadById($_POST['id']);
        } else {
            $kanbans->new();
        }
        $kanban = $kanbans->current();
        $kanban->updateFromPost($_POST);
        $kanbans->save($kanban);

        TWIG->redirect('/kanban');
    }

    /**
     * Save task
     *
     * @return void
     */
    #[NoReturn] public function saveTasks(): void
    {
        $this->checkRights();

        if (isset($_POST['worker_ids'])) {
            $_POST['worker_ids'] = json_encode($_POST['worker_ids']);
        } else {
            $_POST['worker_ids'] = json_encode([]);
        }

        $kanbansTasks = new KanbansTasksRepo();
        if (isset($_POST['id']) && $_POST['id'] > 0) {
            $kanbansTasks->loadById($_POST['id']);
        } else {
            $kanbansTasks->new();
        }
        $kanbansTask = $kanbansTasks->current();
        $kanbansTask->updateFromPost($_POST);
        $kanbansTasks->save($kanbansTask);

        TWIG->redirect('/kanban/board/' . $_POST['kanban_id']);
    }
}
