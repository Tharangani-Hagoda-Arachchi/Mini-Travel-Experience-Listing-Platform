import React from 'react'
import TravelEventCard from '../../components/TravelEventCard/TravelEventCard'

export const Home = () => {
  return (
    <div className="home-container">
      <main className='content'>
        <div className="cards-wrapper">
          <TravelEventCard />
        </div>
      </main>

    </div>
  )
}
