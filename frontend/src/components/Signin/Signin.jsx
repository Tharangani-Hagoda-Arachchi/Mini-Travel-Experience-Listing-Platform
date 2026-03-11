import React from 'react'
import './Signin.css'
import { authContext } from '../../contexts/authContext'
import { validateForm } from '../../services/authValidation'
import { signinUser, signupUser } from '../../services/api'
import { assets } from '../../assets/asset'

const Signin = ({ setShowSignin }) => {

    // for current state
    const [curentState, setCurrentState] = React.useState("Sign In")
    // store form data
    const [formData, setFormData] = React.useState({ firstName: '', lastName: '', email: '', password: '', role: '' })
    // store error message
    const [error, setError] = React.useState('')

    const { login } = React.useContext(authContext)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    //handle form submision
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        //validate form data
        const errorMessage = validateForm(formData, curentState);
        if (errorMessage) {
            setError(errorMessage);
            return;
        }


        try {
            if (curentState === "Sign Up") {
                const payload = { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, password: formData.password, role: formData.role };
                const res = await signupUser(payload);
                console.log("SignUp response:", res);
            } else {
                const payload = { email: formData.email, password: formData.password };
                const res = await signinUser(payload);
                console.log("SignIn response:", res);


                //store access token
                const accessToken = res.accessToken;
                if (accessToken) {
                    login(accessToken); // store in context & localStorage
                } else {
                    alert("No access token returned from backend");
                }
            }
            setShowSignin(false);
            alert(`${curentState} successful!`);
        } catch (err) {
            alert(err.response?.data?.message || 'Error occurred');
        }
    };


    return (
        <div className='signin'>
            <form className='signin-container' onSubmit={handleSubmit}>
                <div className="signin-title">
                    <h2>{curentState}</h2>
                    <img onClick={() => setShowSignin(false)} src={assets.crossIcon} alt="" />
                </div>
                <div className="signin-inputs">
                    {curentState === "Sign In" ? <></> : <select name="role" required value={formData.role} onChange={handleChange}>
                        <option value="">Select Your Role</option>
                        <option value="Traveler">Traveler</option>
                        <option value="Experience Provider">Experience Provider</option>
                    </select>}
                    {curentState === "Sign In" ? <></> : <input type="text" name='firstName' placeholder='Your Name' required value={formData.firstName} onChange={handleChange} />}
                    {curentState === "Sign In" ? <></> : <input type="text" name='lastName' placeholder='Your Last Name' required value={formData.lastName} onChange={handleChange} />}
                    <input type="email" name='email' placeholder='Your Email' required value={formData.email} onChange={handleChange} />
                    <input type="password" name='password' placeholder='Password' value={formData.password} required onChange={handleChange} />
                    {error && <p className="error">{error}</p>}

                </div>
                <button type='submit'>{curentState === "Sign Up" ? "Sign Up" : "Sign In"}</button>
                <div className="signin-condition">
                    <input type="checkbox" required />
                    <p> By continuing, I agree to the terms of use & privacy policy</p>
                </div>
                {curentState === "Sign In"
                    ? <p>Crate a new account? <span onClick={() => setCurrentState("Sign Up")}>Click Here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrentState("Sign In")}>Sign In Here</span></p>}

            </form>

        </div>
    )
}

export default Signin