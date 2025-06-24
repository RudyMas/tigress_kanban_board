document.addEventListener('DOMContentLoaded', function () {
    // Tooltips initialiseren
    initTooltips();

    // Alleen als we schrijf-rechten hebben
    if (variables.schrijf) {
        const taskLists = document.querySelectorAll('.task-list');

        taskLists.forEach(list => {
            Sortable.create(list, {
                group: 'kanban-taken',
                animation: 150,
                onAdd: function (evt) {
                    const taskItem = evt.item;
                    const taskId = taskItem.dataset.id;

                    const newStatusList = evt.to.closest('.task-column');
                    const newStatus = newStatusList?.dataset.status;

                    if (!taskId || !newStatus) return;

                    // Optioneel: class verwijderen
                    newStatusList.classList.remove('ui-droppable-active');

                    // Backend call
                    fetch('/kanban/bord/update/status', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: new URLSearchParams({
                            id: taskId,
                            status: newStatus
                        })
                    })
                        .then(response => {
                            if (response.ok) {
                                console.log('Task updated successfully');
                                location.reload();
                            } else {
                                console.log('Fout bij bijwerken');
                            }
                        })
                        .catch(() => console.log('Fout bij verbinding met server'));
                }
            });
        });
    }

    // Modal vullen
    const modalVerwijderen = document.getElementById('modalVerwijderen');
    if (modalVerwijderen) {
        modalVerwijderen.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const id = button.getAttribute('data-id');
            const kanban_id = button.getAttribute('data-kanban-id');

            const footer = modalVerwijderen.querySelector('.modal-footer');
            footer.querySelector('#id').value = id;
            footer.querySelector('#kanban_id').value = kanban_id;
        });
    }

    // Automatisch refresh na 5 minuten
    setTimeout(() => location.reload(), 300000);
});
