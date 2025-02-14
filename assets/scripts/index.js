import { Login } from "./auth/login.js";
import { ProfilePage } from "./profile/profile.js";
import { checkAuth, logout } from "./auth/auth.js";

// Register the custom elements (each only once).
customElements.define('login-page', Login);
customElements.define('profile-page', ProfilePage);

if (checkAuth()) {
  document.body.innerHTML = `
    <button class="logout-button">Logout</button>
    <profile-page></profile-page>`;
    
  document.querySelector('.logout-button').addEventListener('click', logout);
} else {
  document.body.innerHTML = `<login-page></login-page>`;
}
