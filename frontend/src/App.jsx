import React, { useState } from 'react'
import { Home } from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Signin from './components/Signin/Signin'
import EventManage from './pages/EventMange/EventManage'
import EventDetail from './pages/EventDetail/EventDetail'




function App() {

  //useState for popup login form
  const [showSignin, setShowSignin] = React.useState(false)

  return (
    <>
      {showSignin && <Signin setShowSignin={setShowSignin} />}
      <Navbar setShowSignin={setShowSignin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event-manage" element={<EventManage />} />
        <Route path="/event/:id" element={<EventDetail />} />
      </Routes>


    </>
  )
}

export default App
