import React from 'react'

const Navbar = () => {
    //use state for menues
    const [menue, setMenue] = React.useState("Home")

    return (
        <div>
            <div className="navbar">
                <Link to='/' onClick={() => setMenue("Home")}><img className='logo' src={assets.logo} alt="Travel Advisor" /></Link>
                <ul className='navbar-menues'>
                    <li onClick={() => setMenue("Home")} className={menue === "Home" ? "active" : ""}> <Link to="/">Home</Link></li>
                </ul>
            </div>
        </div>
    )
}

export default Navbar