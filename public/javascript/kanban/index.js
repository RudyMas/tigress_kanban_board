document.addEventListener('DOMContentLoaded', function () {
    window.tigress = window.tigress || {};

    const statusTeksten = [
        'Niet gestart',
        'Voorbereiding',
        'Ontwikkeling',
        'Testfase',
        'Afgerond',
        'In de wacht',
    ];

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

            access_level: 'Toegangsniveau',
            archive: 'Archiveren',
            edit: 'Bewerk',
            edit_rights: 'Bewerk Rechten',
            email: 'Email',
            family_name: 'Familienaam',
            first_name: 'Voornaam',
            last_login: 'Laatste Aanmelding',
            no_login: 'Geen aanmelding',
            restore: 'Herstellen',
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

            access_level: 'Niveau d\'accès',
            archive: 'Archiver',
            edit: 'Éditer',
            edit_rights: 'Modifier les droits',
            email: 'E-mail',
            family_name: 'Nom de famille',
            first_name: 'Prénom',
            last_login: 'Dernière connexion',
            no_login: 'Aucune connexion',
            restore: 'Restaurer',
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

            access_level: 'Zugriffslevel',
            archive: 'Archivieren',
            edit: 'Bearbeiten',
            edit_rights: 'Rechte bearbeiten',
            email: 'E-Mail',
            family_name: 'Familienname',
            first_name: 'Vorname',
            last_login: 'Letzte Anmeldung',
            no_login: 'Keine Anmeldung',
            restore: 'Wiederherstellen',
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

            access_level: 'Nivel de acceso',
            archive: 'Archivar',
            edit: 'Editar',
            edit_rights: 'Editar derechos',
            email: 'Correo electrónico',
            family_name: 'Apellido',
            first_name: 'Nombre',
            last_login: 'Último inicio de sesión',
            no_login: 'Sin inicio de sesión',
            restore: 'Restaurar',
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

            access_level: 'Livello di accesso',
            archive: 'Archivia',
            edit: 'Modifica',
            edit_rights: 'Modifica diritti',
            email: 'E-mail',
            family_name: 'Cognome',
            first_name: 'Nome',
            last_login: 'Ultimo accesso',
            no_login: 'Nessun accesso',
            restore: 'Ripristina',
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

            access_level: 'Access Level',
            archive: 'Archive',
            edit: 'Edit',
            edit_rights: 'Edit Rights',
            email: 'E-mail',
            family_name: 'Family Name',
            first_name: 'First Name',
            last_login: 'Last Login',
            no_login: 'No login',
            restore: 'Restore',
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
                    return statusTeksten[data] || translations.unknown;
                }
            },
            {
                title: translations.actions,
                data: null,
                className: 'text-nowrap text-center',
                width: '1%',
                render: function (data, type, row) {
                    let acties = `<a href="/kanban/bord/${row.id}" data-bs-toggle="tooltip" title="Kanban bord" class="btn btn-info btn-sm"><i class="fa fa-tasks"></i></a>`;

                    if (variables.verwijder) {
                        if (variables.toon === 'archief') {
                            acties += ` <button type="button" data-bs-toggle="modal" title="Herstellen" data-bs-target="#modalHerstellen" data-id="${row.id}" class="btn btn-success btn-sm"><i class="fa fa-undo"></i></button>`;
                        } else {
                            if (variables.schrijf) {
                                acties += ` <a href="/kanban/edit/${row.id}" data-bs-toggle="tooltip" title="Bewerken" class="btn btn-success btn-sm"><i class="fa fa-pencil"></i></a>`;
                            }
                            acties += ` <button type="button" data-bs-toggle="modal" title="Archiveren" data-bs-target="#modalArchiveren" data-id="${row.id}" class="btn btn-danger btn-sm"><i class="fa fa-archive"></i></button>`;
                        }
                    }

                    return acties;
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
                        return type === 'display' ? `<span class="text-muted">Onbekend</span>` : null;
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

    const modalArchiveren = document.getElementById('modalArchiveren');
    if (modalArchiveren) {
        modalArchiveren.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            modalArchiveren.querySelector('.modal-footer #id').value = button.getAttribute('data-id');
        });
    }

    const modalHerstellen = document.getElementById('modalHerstellen');
    if (modalHerstellen) {
        modalHerstellen.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            modalHerstellen.querySelector('.modal-footer #id').value = button.getAttribute('data-id');
        });
    }
});