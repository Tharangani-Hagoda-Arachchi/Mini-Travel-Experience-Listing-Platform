import React, { useEffect, useState } from 'react'
import './EventDetail.css'
import { fetchTravelExperienceById } from '../../services/api';
import { useParams } from 'react-router-dom';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTravelExperienceById(id);
                setEvent(data);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to load experience');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <p>Loading experience...</p>;
    if (!event) return <p><Event></Event> not found.</p>;

    return (
        <div className="detail-container">
            <h1>{event.title}</h1>
            <p className="location">{event.location}</p>
            <p className="created-by">
                By: {event.createdBy}
            </p>
            <p className="time-posted">{event.postedTime}</p>

            <img
                src={`http://localhost:4000${event.images ? event.images[0] : event.image}`}
                alt={event.title}
                className="detail-image"
            />

            <div className="description">
                <h3>Description:</h3>
                <p>{event.description}</p>
            </div>

            <div className="price">
                <h3>Price:</h3>
                <p>${event.price}</p>
            </div>
        </div>
    )
}

export default EventDetail