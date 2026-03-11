import React, { useEffect, useState } from 'react'
import { getAllExperiences } from '../../services/api';

const TravelEventCard = () => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllExperiences();
                setEvents(data);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to load experiences');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <p style={{ color: 'orange' }}>Loading experiences...</p>;

    return (
        <div className="event-list-container">
            <h1>Travel Events</h1>
            {experiences.length === 0 && <p>No event found.</p>}

            <div className="event-cards">
                {events.map((evnt) => (
                    <div className="event-card" key={evnt._id} 
                        style={{ cursor: 'pointer' }}>
                        <img
                            src={`http://localhost:4000${evnt.images[0]}`}
                            alt={evnt.title}
                            className="event-image"
                        />
                        <div className="event-info">
                            <h3>{evnt.title}</h3>
                            <p className="location">{evnt.location}</p>
                            <p className="description">
                                {evnt.description.length > 80
                                    ? evnt.description.slice(0, 80) + '...'
                                    : evnt.description}
                            </p>
                            <p className="created-by">By: {evnt.createdBy}</p>
                            <p className="time-posted">{evnt.postedTime}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TravelEventCard