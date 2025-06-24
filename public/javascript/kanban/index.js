document.addEventListener('DOMContentLoaded', function () {
    window.tigress = window.tigress || {};

    const statusTexts = variables.statuses;

    const allTranslations = {
        nl: {
            id: 'Id',
            tile: 'Tegel',
            project_name: 'Projectnaam',
            start_date: 'Startdatum',
            end_date: 'Einddatum',
            status: 'Status',
            actions: 'Acties',
            unknown: 'Onbekend',
            kanban_board: 'Kanban Bord',
            restore: 'Herstellen',
            edit: 'Bewerk',
            archive: 'Archiveren',
        },
        fr: {
            id: 'Id',
            tile: 'Tuile',
            project_name: 'Nom du projet',
            start_date: 'Date de début',
            end_date: 'Date de fin',
            status: 'Statut',
            actions: 'Actions',
            unknown: 'Inconnu',
            kanban_board: 'Tableau Kanban',
            restore: 'Restaurer',
            edit: 'Éditer',
            archive: 'Archiver',
        },
        de: {
            id: 'Id',
            tile: 'Kachel',
            project_name: 'Projektname',
            start_date: 'Startdatum',
            end_date: 'Enddatum',
            status: 'Status',
            actions: 'Aktionen',
            unknown: 'Unbekannt',
            kanban_board: 'Kanban Board',
            restore: 'Wiederherstellen',
            edit: 'Bearbeiten',
            archive: 'Archivieren',
        },
        es: {
            id: 'Id',
            tile: 'Mosaico',
            project_name: 'Nombre del proyecto',
            start_date: 'Fecha de inicio',
            end_date: 'Fecha de finalización',
            status: 'Estado',
            actions: 'Acciones',
            unknown: 'Desconocido',
            kanban_board: 'Tablero Kanban',
            restore: 'Restaurar',
            edit: 'Editar',
            archive: 'Archivar',
        },
        it: {
            id: 'Id',
            tile: 'Piastrella',
            project_name: 'Nome del progetto',
            start_date: 'Data di inizio',
            end_date: 'Data di fine',
            status: 'Stato',
            actions: 'Azioni',
            unknown: 'Sconosciuto',
            kanban_board: 'Bacheca Kanban',
            restore: 'Ripristina',
            edit: 'Modifica',
            archive: 'Archivia',
        },
        en: {
            id: 'Id',
            tile: 'Tile',
            project_name: 'Project Name',
            start_date: 'Start Date',
            end_date: 'End Date',
            status: 'Status',
            actions: 'Actions',
            unknown: 'Unknown',
            kanban_board: 'Kanban Board',
            restore: 'Restore',
            edit: 'Edit',
            archive: 'Archive',
        }
    }

    const translations = allTranslations[tigress.shortLang] || allTranslations['en'];

    let url = '/kanban/get/1';
    if (variables.show === 'archive') {
        url = '/kanban/get/0';
    }

    const tableKanbans = new DataTable('#dataTableKanbans', {
        processing: true,
        ajax: {
            url: url,
            dataType: 'json'
        },
        lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, 'Alle']
        ],
        responsive: true,
        columns: [
            {
                title: translations.id,
                data: 'id',
                width: '1%'
            },
            {
                title: translations.tile,
                data: 'tile',
                className: 'text-nowrap',
                width: '1%'
            },
            {
                title: translations.project_name,
                data: 'name',
                width: '10%'
            },
            {
                title: translations.start_date,
                data: 'start_date',
                className: 'text-nowrap text-center',
                width: '1%'
            },
            {
                title: translations.end_date,
                data: 'end_date',
                className: 'text-nowrap text-center',
                width: '1%',
                render: function (data, type, row) {
                    if (type !== 'display') {
                        return moment(data, 'YYYY-MM-DD HH:mm:ss').valueOf();
                    }

                    if (data === '0000-00-00 00:00:00') {
                        return type === 'display' ? `<span class="text-muted">${translations.unknown}</span>` : null;
                    }

                    let formatted = moment(data, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY');
                    const status = row.status;

                    const today = moment().format('YYYY-MM-DD');
                    const in7days = moment().add(7, 'days').format('YYYY-MM-DD');
                    const in14days = moment().add(14, 'days').format('YYYY-MM-DD');

                    if (moment(data).isBefore(today) && status < 4) {
                        return `<span class="bg-danger text-white">&nbsp;${formatted}&nbsp;</span>`;
                    } else if (moment(data).isBefore(in7days) && status < 4) {
                        return `<span class="bg-warning">&nbsp;${formatted}&nbsp;</span>`;
                    } else if (moment(data).isBefore(in14days) && status < 4) {
                        return `<span class="bg-success text-white">&nbsp;${formatted}&nbsp;</span>`;
                    }

                    return formatted;
                }
            },
            {
                title: translations.status,
                data: 'status',
                className: 'text-nowrap text-center',
                width: '1%',
                render: function (data) {
                    return statusTexts[data] || translations.unknown;
                }
            },
            {
                title: translations.actions,
                data: null,
                className: 'text-nowrap text-center',
                width: '1%',
                render: function (data, type, row) {
                    let actions = `<a href="/kanban/board/${row.id}" data-bs-toggle="tooltip" title="${translations.kanban_board}" class="btn btn-info btn-sm"><i class="fa fa-tasks"></i></a>`;

                    if (variables.delete) {
                        if (variables.show === 'archive') {
                            actions += ` <button type="button" data-bs-toggle="modal" title="${translations.restore}" data-bs-target="#modalRestore" data-id="${row.id}" class="btn btn-success btn-sm"><i class="fa fa-undo"></i></button>`;
                        } else {
                            if (variables.write) {
                                actions += ` <a href="/kanban/edit/${row.id}" data-bs-toggle="tooltip" title="${translations.edit}" class="btn btn-success btn-sm"><i class="fa fa-pencil"></i></a>`;
                            }
                            actions += ` <button type="button" data-bs-toggle="modal" title="${translations.archive}" data-bs-target="#modalArchive" data-id="${row.id}" class="btn btn-danger btn-sm"><i class="fa fa-archive"></i></button>`;
                        }
                    }

                    return actions;
                }
            }
        ],
        columnDefs: [
            {
                targets: [3],
                type: 'datetime-moment',
                render: function (data, type) {
                    if (!data) {
                        return '';
                    }
                    if (data === '0000-00-00 00:00:00') {
                        return type === 'display' ? `<span class="text-muted">${translations.unknown}</span>` : null;
                    }
                    return type === 'display'
                        ? moment(data, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')
                        : moment(data, 'YYYY-MM-DD HH:mm:ss').valueOf();
                }
            }
        ],
        order: [[4, 'asc'], [3, 'asc']],
        language: tigress.languageOption,
    });

    // Tooltip initialiseren bij elke redraw
    tableKanbans.on('draw', function () {
        initTooltips();
    });

    const modalArchive = document.getElementById('modalArchive');
    if (modalArchive) {
        modalArchive.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            modalArchive.querySelector('.modal-footer #id').value = button.getAttribute('data-id');
        });
    }

    const modalRestore = document.getElementById('modalRestore');
    if (modalRestore) {
        modalRestore.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            modalRestore.querySelector('.modal-footer #id').value = button.getAttribute('data-id');
        });
    }
});