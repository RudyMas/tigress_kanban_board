<?php

namespace Repository;

use Tigress\Repository;

class KanbansStatusesRepo extends Repository
{
    public function __construct()
    {
        $this->dbName = 'default';
        $this->table = 'kanbans_statuses';
        $this->primaryKey = ['id'];
        $this->model = 'DefaultModel';
        $this->autoload = true;
        $this->softDelete = true;
        parent::__construct();
    }

    /**
     * Create select options for kanban status
     *
     * @param int $kanban_status_id
     * @return string
     */
    public function getSelectOptions(int $kanban_status_id): string
    {
        $this->loadAllActive('sort');
        return $this->createOptions($kanban_status_id, 'Maak je keuze', 'naam');
    }

    /**
     * Get status by id
     *
     * @param int $id
     * @return string
     */
    public function getStatus(int $id): string
    {
        $this->loadById($id);
        return $this->current()->name_nl ?? $this->current()->name_en ?? '';
    }
}
