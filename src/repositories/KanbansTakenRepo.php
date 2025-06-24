<?php

namespace Repository;

use Tigress\Repository;

class KanbansTakenRepo extends Repository
{
    public function __construct()
    {
        $this->dbName = 'default';
        $this->table = 'kanbans_taken';
        $this->primaryKey = ['id'];
        $this->model = 'DefaultModel';
        $this->autoload = true;
        $this->softDelete = true;
        parent::__construct();
    }
}
