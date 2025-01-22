// Handles user login
export const login_handler = async (event) => {
    event.preventDefault()
    const form = event.target.closest('form')
    const email_or_username = form.querySelector('#email_or_username').value.trim()
    const password = form.querySelector('#password').value.trim()
    const errorMessage = form.querySelector('#error-message')

    errorMessage.style.display = 'none'

    if (!email_or_username || !password) {
        errorMessage.textContent = "Email/Username and Password are required."
        errorMessage.style.display = 'block'
        return
    }

    try {
        const response = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${btoa(`${email_or_username}:${password}`)}`,
            },
        })

        if (!response.ok) {
            throw new Error('Invalid login credentials.')
        }

        const token = await response.text()
        if (!token) {
            throw new Error('Token not provided in the response.')
        }

        // Store the token in localStorage and update the page
        localStorage.setItem('authToken', token)
        console.log('Login successful, token:', token)

        // Redirect to authenticated view
        window.location.reload()

    } catch (error) {
        errorMessage.textContent = error.message || "An error occurred during login."
        errorMessage.style.display = 'block'
    }
}

// Handles user logout
export const logout = () => {
    localStorage.removeItem('authToken')
    console.log('User logged out successfully')
    document.body.innerHTML = `
        <login-page></login-page>
    `
}

// Checks if the user is authenticated
export const checkAuth = () => {
    const token = localStorage.getItem('authToken')
    if (!token) {
        console.warn('User is not authenticated')
        return false
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1])) // Decode JWT payload
        const isExpired = Date.now() >= payload.exp * 1000 // Check expiration
        if (isExpired) {
            console.warn('Token has expired')
            logout()
            return false
        }
        console.log('User is authenticated')
        return true
    } catch (error) {
        console.error('Error validating token', error)
        logout()
        return false
    }
}
