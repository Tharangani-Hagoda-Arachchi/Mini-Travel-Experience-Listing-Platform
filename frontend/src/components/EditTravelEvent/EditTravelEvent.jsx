import React, { useState } from 'react'
import { authContext } from '../../contexts/authContext';
import { updateTravelEvent } from '../../services/api';
import { assets } from '../../assets/asset';

const EditTravelEvent = ({ events, setEditEvent, refreshList }) => {

    const { user, token } = React.useContext(authContext);
    const [formData, setFormData] = useState({
        title: events.title,
        location: events.location,
        description: events.description,
        price: events.price,
    });
    const [imagePreview, setImagePreview] = useState(
        events.images?.[0]
            ? `http://localhost:4000${events.images[0]}`
            : null
    );
    const [imageFile, setImageFile] = useState(null);

    // handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.location || !formData.description) {
            setError('All fields are required');
            return;
        }

        try {
            await updateTravelEvent(events._id, formData, imageFile, token);
            alert('Travel Experience updated successfully');
            setEditEvent(null); // close popup
            refreshList(); // refresh parent list
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update experience');
        }
    };
    return (
        <div className="add-travel-event">
            <form className="travel-event-form" onSubmit={handleSubmit}>
                <div className="travel-event-title">
                    <h2>Edit Travel Event</h2>
                    <img onClick={() => setEditEvent(null)} src={assets.crossIcon} alt="close" />
                </div>

                <div className="travel-event-inputs">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />

                    <input type="file" onChange={handleImageChange} />
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                        </div>
                    )}

                </div>

                <button type="submit">Update Travel Event</button>
            </form>
        </div>
    )
}

export default EditTravelEvent