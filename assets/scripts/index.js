import { Login } from "./auth/login.js";
import { ProfilePage } from "./profile/profile.js";
import { checkAuth, logout } from "./auth/auth.js";

// Define the custom element.
customElements.define('login-page', Login);
customElements.define('profile-page', ProfilePage);

if (checkAuth()) {
    document.body.innerHTML = `<profile-page></profile-page>`;

    const logoutButton = document.querySelector('.logout-button');
    logoutButton.addEventListener('click', logout);
} else {
    document.body.innerHTML = `<login-page></login-page>`;
}
