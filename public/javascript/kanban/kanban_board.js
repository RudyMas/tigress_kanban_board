document.addEventListener('DOMContentLoaded', function () {
    // Tooltips initialiseren
    initTooltips();

    // Alleen als we schrijf-rechten hebben
    if (variables.write) {
        const taskLists = document.querySelectorAll('.task-list');

        taskLists.forEach(list => {
            Sortable.create(list, {
                group: 'kanban-tasks',
                animation: 150,
                onAdd: function (evt) {
                    const taskItem = evt.item;
                    const taskId = taskItem.dataset.id;

                    const newStatusList = evt.to.closest('.task-column');
                    const newStatus = newStatusList?.dataset.status;

                    if (!taskId || !newStatus) return;

                    // Optional: remove class
                    newStatusList.classList.remove('ui-droppable-active');

                    // Backend call
                    fetch('/kanban/board/update/status', {
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
                                console.log('Failed to update task status');
                            }
                        })
                        .catch(() => console.log('Error updating task status'));
                }
            });
        });
    }

    // Modal vullen
    const modalDelete = document.getElementById('modalDelete');
    if (modalDelete) {
        modalDelete.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;
            const id = button.getAttribute('data-id');
            const kanban_id = button.getAttribute('data-kanban-id');

            const footer = modalDelete.querySelector('.modal-footer');
            footer.querySelector('#id').value = id;
            footer.querySelector('#kanban_id').value = kanban_id;
        });
    }

    // Automatisch refresh na 5 minuten
    setTimeout(() => location.reload(), 300000);
});
