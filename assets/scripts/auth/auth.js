// Handles user login
export const loginHandler = async (event) => {
    event.preventDefault();

    const form = event.target.closest('form');
    const emailOrUsername = form.querySelector('#email_or_username').value.trim();
    const password = form.querySelector('#password').value.trim();
    const errorMessage = form.querySelector('#error-message');

    // Hide error message initially
    errorMessage.style.display = 'none';

    // Validate input fields
    if (!emailOrUsername || !password) {
        showError(errorMessage, "Email/Username and Password are required.");
        return;
    }

    try {
        const response = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${btoa(`${emailOrUsername}:${password}`)}`,
            },
        });

        if (!response.ok) {
            throw new Error('Invalid login credentials.');
        }

        const token = await response.text();
        if (!token) {
            throw new Error('Token not provided in the response.');
        }

        // Store the token and refresh the page
        localStorage.setItem('authToken', token);
        console.log('Login successful, token:', token);
        window.location.reload();
    } catch (error) {
        showError(errorMessage, error.message || "An error occurred during login.");
    }
};

// Displays an error message
const showError = (element, message) => {
    element.textContent = message;
    element.style.display = 'block';
};

// Handles user logout
export const logout = () => {
    localStorage.removeItem('authToken');
    console.log('User logged out successfully');

    // Redirect to login page
    document.body.innerHTML = `<login-page></login-page>`;
};

// Checks if the user is authenticated
export const checkAuth = () => {
    const token = localStorage.getItem('authToken');

    if (!token) {
        console.warn('User is not authenticated');
        return false;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        const isExpired = Date.now() >= payload.exp * 1000; // Check expiration

        if (isExpired) {
            console.warn('Token has expired');
            logout();
            return false;
        }

        console.log('User is authenticated');
        return true;
    } catch (error) {
        console.error('Error validating token', error);
        logout();
        return false;
    }
};
