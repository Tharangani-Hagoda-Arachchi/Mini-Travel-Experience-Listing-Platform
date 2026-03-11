import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:4000/api/v1',

});

//user signup
export const signupUser = async (data) => {
    try {
        const payload = {
            userFirstName: data.firstName,
            userLastName: data.lastName,
            email: data.email,
            password: data.password,
            role: data.role,
        };
        const response = await API.post(`/auths/register`, payload, {
            headers: { "Content-Type": "application/json" }
        });
        return response.data;

    } catch (err) {
        console.error('SignUp error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
        });
        throw err;
    }
};


//user signin
export const signinUser = async (data) => {
    try {
        const payload = {
            email: data.email,
            password: data.password,
        };
        const response = await API.post(`/auths/login`, payload, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
        });
        return response.data;
    } catch (err) {
        console.error('SignIn error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
        });
        throw err;
    }
};

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


//travel event creation
export const createTravelEvent = async (data, token) => {
    try {
        const payload = {
            title: data.title,
            location: data.location,
            description: data.description,
            price: data.price,
            createdBy: data.createdBy,
            image: data.image
        };
        const response = await API.post(`/events`, payload, {

            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        });
        return response.data;
    } catch (err) {
        console.error('Create Travel Event error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data,
        });
        throw err;
    }
};

// Get all travel experiences
export const getAllExperiences = async () => {
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

// Get single travel experience by ID (no auth)
export const fetchTravelExperienceById = async (id) => {
    try {
        const response = await API.get(`/events/details/${id}`, {
            headers: { "Content-Type": "application/json" }
        });

        return response.data.data;

    } catch (err) {
        console.error('Fetch experience by ID error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data
        });
        throw err;
    }
};

// Get event by user id (createdBy)
export const getEventsByCreatedBy = async (userId, token) => {
    try {
        const res = await API.get(`/events/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data.data;
    } catch (err) {
        console.error('Fetch experiences error:', err.response?.data || err.message);
        throw err;
    }
};

// // Delete travel experience
export const deleteTravelExperience = async (id, token) => {
    try {
        const res = await API.delete(`/events/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        });
        return res.data;
    } catch (err) {
        console.error('Delete experience error:', err.response?.data || err.message);
        throw err;
    }
};


// Update travel events
export const updateTravelEvent = async (id, data, imageFile, token) => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('location', data.location);
        formData.append('description', data.description);
        formData.append('price', data.price);

        if (imageFile) {
            formData.append('image', imageFile);
        }

        const res = await API.put(`/events/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data;
    } catch (err) {
        console.error('Update experience error:', err.response?.data || err.message);
        throw err;
    }
};