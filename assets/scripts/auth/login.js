import { login_handler } from "./auth.js";

export class Login {
    static create() {
        const form = document.createElement('div');
        form.classList.add('login-form');
        form.innerHTML = `
            <form class="form" id="login-form">
                <h1 class="form__title">Login</h1>
                <label for="email_or_username" class="form__label">Email or Username</label>
                <input type="text" class="form__input" id="email_or_username" placeholder="Email or Username" required>
                
                <label for="password" class="form__label">Password</label>
                <input type="password" class="form__input" id="password" placeholder="Password" required>
                
                <button type="submit" class="form__button">Login</button>
                <p class="form__error" id="error-message" style="display: none;"></p>
            </form>
        `;

        form.querySelector('#login-form').addEventListener('submit', login_handler);
        return form;
    }
}
