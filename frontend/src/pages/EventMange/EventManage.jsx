import React, { useState } from 'react'
import './EventManage.css'
import TravelEventList from '../../components/TravelEventList/TravelEventList';
import AddTravelEvent from '../../components/AddTravelEvent/AddTravelEvent';

const EventManage = () => {

    const [showAddEvent, setShowAddEvent] = useState(false);

    return (
        <div className="manage-travel-container">
            <div className="travel-list-header">
                <div className="header-left">
                    <h1>Manage Travel List</h1>
                    <p>Dashboard / Manage Travel List</p>
                </div>

                <div className="header-right">
                    <button className="add-travel-btn" onClick={() => setShowAddEvent(true)}>
                        + Add Travel List
                    </button>
                </div>

            </div>
            <div className="list">
                <TravelEventList />
            </div>

            {showAddEvent && (
                <AddTravelEvent setShowAddEvent={setShowAddEvent} />

            )}
        </div>
    )
}

export default EventManage