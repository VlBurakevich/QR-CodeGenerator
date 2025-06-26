import {getSession} from '../api/apiClient.js';

export const initializeSession = async () => {
    try {
        let token = localStorage.getItem('jwt_token');

        if (!token) {
            console.log("No token found in local session, creating a new session");
            const response = await getSession();
            token = response.data.token;

            if (token) {
                localStorage.setItem('jwt_token', token);
                console.log("New session created and token stored.");
            }
        } else {
            console.log("Existing session token found in localStorage.");
        }
    } catch (error) {
        console.error("Failed to initialize session", error);
        localStorage.removeItem('jwt_token');
        alert("Could not connect to the server to start a session. Please refresh the page.");
    }
}