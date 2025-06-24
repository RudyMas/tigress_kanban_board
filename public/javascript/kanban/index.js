document.addEventListener('DOMContentLoaded', function () {
    let url = '/kanban/get/1';
    if (variables.toon === 'archief') {
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
            {title: 'ID', data: 'id', width: '1%'},
            {title: 'Tegel', data: 'tegel', className: 'text-nowrap', width: '1%'},
            {title: 'Projectnaam', data: 'naam', width: '10%'},
            {
                title: 'Startdatum',
                data: 'start_datum',
                className: 'text-nowrap text-center',
                width: '1%'
            },
            {
                title: 'Einddatum',
                data: 'eind_datum',
                className: 'text-nowrap text-center',
                width: '1%',
                render: function (data, type, row) {
                    if (type !== 'display') {
                        return moment(data, 'YYYY-MM-DD HH:mm:ss').valueOf();
                    }

                    if (data === '0000-00-00 00:00:00') {
                        return type === 'display' ? `<span class="text-muted">Onbekend</span>` : null;
                    }

                    let formatted = moment(data, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY');
                    const status = row.status;

                    const vandaag = moment().format('YYYY-MM-DD');
                    const in7dagen = moment().add(7, 'days').format('YYYY-MM-DD');
                    const in14dagen = moment().add(14, 'days').format('YYYY-MM-DD');

                    if (moment(data).isBefore(vandaag) && status < 4) {
                        return `<span class="bg-danger text-white">&nbsp;${formatted}&nbsp;</span>`;
                    } else if (moment(data).isBefore(in7dagen) && status < 4) {
                        return `<span class="bg-warning">&nbsp;${formatted}&nbsp;</span>`;
                    } else if (moment(data).isBefore(in14dagen) && status < 4) {
                        return `<span class="bg-success text-white">&nbsp;${formatted}&nbsp;</span>`;
                    }

                    return formatted;
                }
            },
            {
                title: 'Status',
                data: 'status',
                className: 'text-nowrap text-center',
                width: '1%',
                render: function (data) {
                    const statusTeksten = [
                        'Niet gestart',
                        'Voorbereiding',
                        'Ontwikkeling',
                        'Testfase',
                        'Afgerond',
                        'In de wacht',
                    ];
                    return statusTeksten[data] || 'Onbekend';
                }
            },
            {
                title: 'Acties',
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
        language: {
            url: '/node_modules/datatables.net-plugins/i18n/nl-NL.json'
        }
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