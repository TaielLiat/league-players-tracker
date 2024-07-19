document.addEventListener('DOMContentLoaded', () => {
    const adminLink = document.getElementById('adminLink');
    const adminModal = document.getElementById('adminModal');
    const submitPassword = document.getElementById('submitPassword');
    const closeModal = document.getElementById('closeModal');
    const adminPassword = document.getElementById('adminPassword');

    // Mostrar el modal de autenticación
    function openModal() {
        adminModal.style.display = 'block';
    }

    // Cerrar el modal de autenticación
    function closeModal() {
        adminModal.style.display = 'none';
        adminPassword.value = ''; // Limpiar el campo de contraseña
    }

    // Verificar la contraseña con el servidor
    async function checkPassword() {
        try {
            const response = await fetch('/check-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: adminPassword.value })
            });

            if (response.ok) {
                closeModal();
                window.location.href = 'admin.html'; // Redirigir a la página de admin
            } else {
                alert('Contraseña incorrecta. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error. Inténtalo de nuevo.');
        }
    }

    // Manejar eventos
    adminLink.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar el comportamiento por defecto del enlace
        openModal();
    });

    submitPassword.addEventListener('click', checkPassword);

    closeModal.addEventListener('click', closeModal);

    window.addEventListener('click', (event) => {
        if (event.target === adminModal) {
            closeModal();
        }
    });
});