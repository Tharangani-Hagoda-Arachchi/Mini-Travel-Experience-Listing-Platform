import React, { useContext, useEffect, useState } from 'react'
import './TravelEventList.css';
import { authContext } from '../../contexts/authContext';
import { deleteTravelExperience, getEventsByCreatedBy } from '../../services/api';
import EditTravelEvent from '../EditTravelEvent/EditTravelEvent';
import EventDetail from '../../pages/EventDetail/EventDetail';

const TravelEventList = () => {
    const { token, user } = useContext(authContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editEvent, setEditEvent] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            if (!user || !user._id) return;

            try {
                const data = await getEventsByCreatedBy(user._id, token);
                setEvents(data);
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Failed to load events');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) return;

        try {
            await deleteTravelExperience(id, token);
            setEvents(prev => prev.filter(evnt => evnt._id !== id));
            alert('Event deleted successfully');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to delete event');
        }
    };

    if (loading) return <p>Loading events...</p>;

    return (
        <div className="event-list-container">

            {events.length === 0 && <p>No events found.</p>}

            <div className="event-table">

                {/* Header */}
                <div className="event-row header">
                    <div>Image</div>
                    <div>Title</div>
                    <div>Location</div>
                    <div>Description</div>
                    <div>Price</div>
                    <div>Created Time</div>
                    <div>Actions</div>
                </div>

                {/* Data Rows */}
                {events.map(evnt => (
                    <div className="event-row" key={evnt._id}>

                        <div>
                            <img
                                src={`http://localhost:4000${evnt.images?.[0]}`}
                                alt={evnt.title}
                                className="table-image"
                            />
                        </div>

                        <div>{evnt.title}</div>

                        <div>{evnt.location}</div>

                        <div className="desc">{evnt.description}</div>

                        <div>${evnt.price}</div>

                        <div>{new Date(evnt.createdAt).toLocaleString()}</div>

                        <div className="actions">
                            <button onClick={() => setEditEvent(evnt)}>Edit</button>
                            <button onClick={() => handleDelete(evnt._id)}>Delete</button>
                        </div>

                    </div>
                ))}

            </div>

            {editEvent && (
                <EditTravelEvent
                    events={editEvent}
                    setEditEvent={setEditEvent}
                    refreshList={async () => {
                        const data = await getEventsByCreatedBy(user._id, token);
                        setEvents(data);
                    }}
                />
            )}


        </div>
    )
}

export default TravelEventList