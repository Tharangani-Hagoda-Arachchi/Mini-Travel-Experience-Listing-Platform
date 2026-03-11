import React, { useState } from 'react'
import { Home } from './pages/Home/Home'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Signin from './components/Signin/Signin'




function App() {

  //useState for popup login form
  const [showSignin, setShowSignin] = React.useState(false)

  return (
    <>
      {showSignin && <Signin setShowSignin={setShowSignin} />}
      <Navbar setShowSignin={setShowSignin} />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>


    </>
  )
}

export default App
