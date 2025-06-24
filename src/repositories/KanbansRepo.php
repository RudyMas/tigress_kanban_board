<?php

namespace Repository;

use Tigress\Repository;

class KanbansRepo extends Repository
{
    public function __construct()
    {
        $this->dbName = 'default';
        $this->table = 'kanbans';
        $this->primaryKey = ['id'];
        $this->model = 'DefaultModel';
        $this->autoload = true;
        $this->softDelete = true;
        parent::__construct();
    }

    /**
     * Ophalen van een lijst van de tegels
     *
     * @return array
     */
    public function getTileList(): array
    {
        $sql = "SELECT DISTINCT tile FROM kanbans";
        return $this->getByQuery($sql);
    }
}
