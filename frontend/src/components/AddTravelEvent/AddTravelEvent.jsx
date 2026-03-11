import React from 'react'
import './AddTravelEvent.css'
import { authContext } from '../../contexts/authContext';
import { assets } from '../../assets/asset';
import { createTravelEvent } from '../../services/api';

const AddTravelEvent = ({setShowAddEvent }) => {

    // store form data
    const [formData, setFormData] = React.useState({ title: '', location: '', description: '', price: '', image: null })

    //image preview    const [preview, setPreview] = React.useState(null);
    const [preview, setPreview] = React.useState(null);

    const { user, token } = React.useContext(authContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ ...prev, image: file }));

        // preview
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        if (file) reader.readAsDataURL(file);
    };

    //handle form submision
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        try {
            const payload = { title: formData.title, location: formData.location, description: formData.description, price: formData.price, createdBy: user._id, image: formData.image };
            const res = await createTravelEvent(payload, token);
            console.log("Create Travel Event response:", res);
            setShowAddEvent(false);
            alert(`Travel event added successfully!`);
        } catch (err) {
            alert(err.response?.data?.message || 'Error occurred');
        }
    };
    return (
        <div className='add-travel-event'>
            <form className='travel-event-form' onSubmit={handleSubmit}>
                <div className="travel-event-title">
                    <h2>Add New Travel Event</h2>
                    <img onClick={() => setShowAddEvent(false)} src={assets.crossIcon} alt="" />
                </div>
                <div className="travel-event-inputs">
                    <input type="text" name='title' placeholder='Title' value={formData.title} onChange={handleChange} required />
                    <input type="text" name='location' placeholder='Location' value={formData.location} onChange={handleChange} required />
                    <textarea name='description' placeholder='Description' value={formData.description} onChange={handleChange} rows="4" required />
                    <input type="number" name='price' placeholder='Price' value={formData.price} onChange={handleChange} />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />

                    {preview && (
                        <div className="image-preview">
                            <img src={preview} alt="Preview" />
                        </div>
                    )}

                    {/* {error && <p className="error">{error}</p>} */}
                </div>
                <button type='submit'>Add Travel Event</button>
            </form>

        </div>
    )
}

export default AddTravelEvent