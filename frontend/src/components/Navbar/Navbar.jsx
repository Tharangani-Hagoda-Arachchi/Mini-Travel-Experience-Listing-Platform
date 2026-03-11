import React from 'react'
import { authContext } from '../../contexts/authContext';
import './Navbar.css';
import { assets } from '../../assets/asset';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setShowSignin }) => {

    const [menue, setMenue] = React.useState("Home")
    const { token, logout, user } = React.useContext(authContext);

    const navigate = useNavigate();
    const handleClick = () => {
        // Navigate to event manage page
        navigate("/event-manage"); 
    };

    return (
        <div>
            <div className="navbar">
                <Link to='/' onClick={() => setMenue("Home")}><img className='logo' src={assets.logo} alt="Travel Advisor" /></Link>
                <ul className="navbar-menues">
                    <li onClick={() => setMenue("Home")} className={menue === "Home" ? "active" : ""}> <Link to="/">Home</Link></li>

                    {token && user.role === "Experience Provider" && (
                        <button className="sign-in" onClick={handleClick} >
                            Manage Event
                        </button>
                    )}
                    {
                        token ? (
                            <button className="sign-in" onClick={logout}>LOGOUT</button>
                        ) : (
                            <button className="sign-in" onClick={() => setShowSignin(true)}>SIGN IN</button>
                        )
                    }

                </ul>

            </div>
            <hr></hr>

        </div>
    )
}

export default Navbar