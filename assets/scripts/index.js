import { Login } from "./auth/login.js";
import { checkAuth, logout } from "./auth/auth.js";

// Define the custom element.
customElements.define('login-page', Login);

if (checkAuth()) {
    document.body.innerHTML = `
        <h1>Authenticated</h1>
        <button class="logout-button">Logout</button>
    `

    const logoutButton = document.querySelector('.logout-button');
    logoutButton.addEventListener('click', logout);
} else {
    document.body.innerHTML = `<login-page></login-page>`;
    // apply css file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = './assets/styles/auth/login.css';
    document.head.appendChild(link);
}
