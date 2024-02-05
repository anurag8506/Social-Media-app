import "./register.css"

export default function Register() {
  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginLeft">
    <h3 className="loginLogo">SkyRocket</h3>
    <span className="loginDesc">
        Make friends and explore courses, jobs on  SkyRocket (A Yogesh Tripathi Initiative :)
    </span>
            </div>
            <div className="loginRight">
                <div className="loginBox">
                    <input placeholder="Username" className="loginInput" />
                    <input placeholder="Password" className="loginInput" />
                    <input placeholder="Confirm Password" className="loginInput" />
                    <input placeholder="Password" className="loginInput" />
                    <button className="loginButton">
                        Sign Up
                    </button>
                    
                    <button className="loginRegisterButton">Log into Account</button>
                </div>
            </div>
        </div>

    </div>
  )
}
