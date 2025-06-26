document.addEventListener('DOMContentLoaded', function () {
    window.tigress = window.tigress || {};

    const statusTexts = variables.statuses;

    const base_trans = language.base[tigress.shortLang] || language.base['en'];
    const translations = language.local[tigress.shortLang] || language.local['en'];

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
                title: base_trans.id,
                data: 'id',
                width: '1%'
            },
            {
                title: base_trans.tile,
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
                title: base_trans.start_date,
                data: 'start_date',
                className: 'text-nowrap text-center',
                width: '1%'
            },
            {
                title: base_trans.end_date,
                data: 'end_date',
                className: 'text-nowrap text-center',
                width: '1%',
                render: function (data, type, row) {
                    if (type !== 'display') {
                        return moment(data, 'YYYY-MM-DD HH:mm:ss').valueOf();
                    }

                    if (data === '0000-00-00 00:00:00') {
                        return type === 'display' ? `<span class="text-muted">${base_trans.unknown}</span>` : null;
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
                title: base_trans.status,
                data: 'status',
                className: 'text-nowrap text-center',
                width: '1%',
                render: function (data) {
                    return statusTexts[data] || base_trans.unknown;
                }
            },
            {
                title: base_trans.actions,
                data: null,
                className: 'text-nowrap text-center',
                width: '1%',
                render: function (data, type, row) {
                    let actions = `<a href="/kanban/board/${row.id}" data-bs-toggle="tooltip" title="${translations.kanban_board}" class="btn btn-info btn-sm"><i class="fa fa-tasks"></i></a>`;

                    if (variables.delete) {
                        if (variables.show === 'archive') {
                            actions += ` <button type="button" data-bs-toggle="modal" title="${base_trans.restore}" data-bs-target="#modalRestore" data-id="${row.id}" class="btn btn-success btn-sm"><i class="fa fa-undo"></i></button>`;
                        } else {
                            if (variables.write) {
                                actions += ` <a href="/kanban/edit/${row.id}" data-bs-toggle="tooltip" title="${base_trans.edit}" class="btn btn-success btn-sm"><i class="fa fa-pencil"></i></a>`;
                            }
                            actions += ` <button type="button" data-bs-toggle="modal" title="${base_trans.archive}" data-bs-target="#modalArchive" data-id="${row.id}" class="btn btn-danger btn-sm"><i class="fa fa-archive"></i></button>`;
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
                        return type === 'display' ? `<span class="text-muted">${base_trans.unknown}</span>` : null;
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