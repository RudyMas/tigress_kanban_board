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
        $language = substr(CONFIG->website->html_lang, 0, 2) ?? 'en';
        $field = 'name_' . $language;

        $this->loadAllActive('sort');

        if (!isset($this->current()->$field)) {
            $field = 'name_en';
        }

        return $this->createOptions($kanban_status_id, __('Make a Choice'), $field);
    }

    /**
     * Get status by id
     *
     * @param int $id
     * @return string
     */
    public function getStatus(int $id): string
    {
        $language = substr(CONFIG->website->html_lang, 0, 2) ?? 'en';
        $field = 'name_' . $language;

        $this->loadById($id);

        if (!isset($this->current()->$field)) {
            $field = 'name_en';
        }

        return $this->current()->$field;
    }
}