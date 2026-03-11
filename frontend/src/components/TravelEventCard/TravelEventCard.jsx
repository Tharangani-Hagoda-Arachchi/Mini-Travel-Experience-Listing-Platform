import React, { useEffect, useState } from 'react'
import { getAllExperiences } from '../../services/api';
import './TravelEventCard.css';
import { useNavigate } from 'react-router-dom';

const TravelEventCard = () => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const goToDetail = (id) => {
        navigate(`/event/${id}`);
    };

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

    if (loading) return <p style={{ color: 'orange' }}>Loading events..</p>;

    return (
        <div className="event-list-container">
            <h1>Travel Events</h1>
            {events.length === 0 && <p>No event found.</p>}

            <div className="event-cards">
                {events.map((evnt) => (
                    <div className="event-card" key={evnt._id} onClick={() => goToDetail(evnt._id)}
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