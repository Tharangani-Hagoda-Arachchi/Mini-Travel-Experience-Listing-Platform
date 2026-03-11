import axios from 'axios'

const API = axios.create({
    baseURL: 'http://localhost:4000/api/v1',

});

// logout
export const logoutUser = async () => {
    try {
        const response = await API.post(`/auths/logout`,
            {},
            { withCredentials: true }
        );
        return response.data;
    } catch (err) {
        console.error('Logout error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
        });
        throw err;
    }
};

// Get all travel events
export const getAllEvents = async () => {
    try {
        const response = await API.get('/events', {
            headers: { "Content-Type": "application/json", withCredentials: true }
        });

        return response.data.data;

    } catch (err) {
        console.error('Fetch all experiences error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data
        });

        throw err;
    }
};