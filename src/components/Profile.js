import { useCookies } from 'react-cookie'
import '../styles/Profile.css'
import LogoutModal from './Modals/Logout'

export default function Profile() {
    const [user, , removeUser] = useCookies(['user'])
    var username

    if (String(user).length > 0)
        username = String(user.user)

    return (
        <div className='dropdown'>
            <div id='profile'>
                <button className='btn btn-secondary dropdown-toggle' type="button" data-bs-toggle="dropdown" aria-expanded="false">{username}</button>
                <ul className="dropdown-menu">
                    <li><a className='dropdown-item' href='/Settings'>Setttings</a></li>
                    <li><button className='dropdown-item' data-bs-toggle="modal" data-bs-target="#exampleModalDefault">Log out</button></li>
                </ul>
            </div>
            <div id="modal-holder">
                <div className="modal fade" id="exampleModalDefault" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <LogoutModal props={removeUser} />
                </div>
            </div>
        </div>
    )
}