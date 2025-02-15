import { Login } from "./auth/login.js";
import { ProfilePage } from "./profile/profile.js";
import { checkAuth, logout } from "./auth/auth.js";

// Register custom elements (only once)
customElements.define('login-page', Login);
customElements.define('profile-page', ProfilePage);

// Check for authentication
if (checkAuth()) {
  // User is authenticated, display the profile page with logout option
  document.body.innerHTML = `
    <button class="logout-button">Logout</button>
    <profile-page></profile-page>`;

  // Add logout event listener
  document.querySelector('.logout-button').addEventListener('click', logout);
} else {
  // User is not authenticated, display the login page
  document.body.innerHTML = `<login-page></login-page>`;
}
