import { Login } from "./auth/login"
import { checkAuth, logout } from "./auth/auth"

customElements.define('login-page', Login)

if (checkAuth()) {
    document.body.innerHTML = `
        <h1>Authenticated</h1>
        <button class="logout-button" onclick="logout()">Logout</button>
    `
}else{
    document.body.innerHTML = `
        <login-page></login-page>
    `
}