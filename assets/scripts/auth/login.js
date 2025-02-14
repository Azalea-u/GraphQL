import { login_handler } from "./auth.js";

export class Login extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        input {
          background-color: transparent;
          width: 100%;
          border: none;
          outline: none;
          color: var(--C);
          font-family: 'VT323', Helvetica, sans-serif;
          text-shadow: 0 0 5px var(--Ts);
          font-size: calc(1em + 0.5vw);
          padding: 10px;
        }

        input:focus {
          outline: none;
        }

        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px var(--Bg) inset !important;
          -webkit-text-fill-color: var(--C);
        }

        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 100px var(--Bg) inset;
          -webkit-text-fill-color: var(--C);
        }

        input:-webkit-autofill::first-line {
          -webkit-text-fill-color: var(--C);
        }

        .input_container {
          position: relative;
          margin-bottom: 15px;
        }

        .input_container::before {
          content: ">";
          position: absolute;
          top: 10px;
          left: -15px;
          color: var(--C);
          font-family: 'VT323', Helvetica, sans-serif;
          text-shadow: 0 0 5px var(--Ts);
        }

        ::selection {
          background-color: var(--C);
          color: var(--Bg);
        }

        button {
          background: transparent;
          color: var(--C);
          border: none;
          padding: 8px;
          font-family: 'VT323', Helvetica, sans-serif;
          font-size: calc(1em + 0.5vw);
          cursor: pointer;
          text-decoration: underline;
          display: block;
        }
      </style>
      
      <form class="form" id="login-form">
        <label for="email_or_username" class="form__label">Username:</label>
        <div class="input_container">
          <input type="text" class="form__input" id="email_or_username" required autofocus>
        </div>
        <label for="password" class="form__label">Password:</label>
        <div class="input_container">
          <input type="password" class="form__input" id="password" required>
        </div>
        <button type="submit" class="form__button">Proceed</button>
        <p class="form__error" id="error-message" style="display: none;"></p>
      </form>
    `;

    // Add event listener to handle form submission.
    this.shadowRoot.querySelector('#login-form').addEventListener('submit', login_handler);
  }
}
