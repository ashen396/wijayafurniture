import CryptoJS from 'crypto-js'
import { CookiesProvider, useCookies } from 'react-cookie'
import properties from '../properties.json'
import '../styles/Login.css'
import DataAccessLayer from './DAL/DataAccessLayer'

function Login() {

    /**
     * Function to handle user authentication
     * Returns true if valid credentials provided
     * @returns false
     */
    async function UserAuthentication(username = String, password = String) {

        let url = properties['server-name'] + "Users"
        let users = new DataAccessLayer(url)
        let credentials = {
            "username": username,
            "password": password
        }
        let data = await users.AuthenticateUser(credentials)
        if (String(data['Status']) === "Error") {
            alert(data['Message'])
            return
        }

        if (String(data['Status']) === "Success") {
            setCookie('user', username, { path: '/', maxAge: 3600 })    //expires in one hour

            let menus = String(data["Menus"])
            localStorage.setItem("Menus", CryptoJS.AES.encrypt(menus.toString(), username).toString())
            return
        }

        if (String(data) === undefined) {
            alert("Error While Authenticating! Please Contact IT!")
            return
        }
    }

    const [, setCookie] = useCookies('')

    function LoginAuth() {
        if (localStorage.length !== 0)
            localStorage.clear()

        const username = document.getElementById("login-username").value
        const password = document.getElementById("login-password").value

        if (String(username).length !== 0 && String(password).length !== 0) {
            UserAuthentication(username, password)
        }
    }

    return (
        <CookiesProvider>
            <div id='main'>
                <div id='login-holder'>
                    <h1>Login</h1>
                    <input id="login-username" type='text' className='form-control' placeholder="Username" />
                    <input id="login-password" type='password' className='form-control' placeholder="Password" />
                    <input id='login-button' type="button" className='btn btn-primary' value='Submit' onClick={() => LoginAuth()} />
                </div>
            </div>
        </CookiesProvider>
    );
}

export default Login