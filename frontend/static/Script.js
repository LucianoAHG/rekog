// JavaScript source code
document.addEventListener('DOMContentLoaded', function () {
    const loginContainer = document.getElementById('login-container');
    const loginForm = document.getElementById('login-form');

    // Animaci�n al cargar la p�gina
    loginContainer.style.opacity = 0;
    loginContainer.style.transform = 'translateY(20px)';
    loginContainer.style.transition = 'opacity 0.5s, transform 0.5s';

    setTimeout(() => {
        loginContainer.style.opacity = 1;
        loginContainer.style.transform = 'translateY(0)';
    }, 500);

    // Animaci�n al hacer hover sobre el bot�n de iniciar sesi�n
    const loginButton = loginForm.querySelector('button');
    loginButton.addEventListener('mouseover', function () {
        loginButton.style.transform = 'scale(1.05)';
        loginButton.style.transition = 'transform 0.3s';
    });

    loginButton.addEventListener('mouseout', function () {
        loginButton.style.transform = 'scale(1)';
    });

    //agregar otras interacciones con JavaScript seg�n sea necesario
});

