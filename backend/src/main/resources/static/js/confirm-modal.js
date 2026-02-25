document.addEventListener('DOMContentLoaded', function () {
    const deleteModal = document.getElementById('deleteConfirmModal');

    if (deleteModal) {
        deleteModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;

            const actionUrl = button.getAttribute('data-action');
            const customMessage = button.getAttribute('data-message');

            const modalMessage = deleteModal.querySelector('#deleteConfirmMessage');
            const modalForm = deleteModal.querySelector('#modalDeleteForm');

            modalMessage.textContent = customMessage;
            modalForm.action = actionUrl;
        });
    }
});