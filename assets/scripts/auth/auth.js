// Handles user login
export const login_handler = async (event) => {
    event.preventDefault()
    const email_or_username = document.getElementById('email_or_username').value.trim()
    const password = document.getElementById('password').value.trim()
    const errorMessage = document.getElementById('error-message')

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

        const data = await response.json()
        const token = data.token

        // Store the token in localStorage
        localStorage.setItem('authToken', token)
        console.log('Login successful, token:', token)

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
        const payload = JSON.parse(atob(token.split('.')[1])) // Decode the payload of the JWT
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
