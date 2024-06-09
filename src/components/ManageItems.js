import SideMenu from "./SideMenu"
import Profile from "./Profile"
import CheckAuth from "./BLL/CheckAuthorization"

export default function ManageItems() {
    return (
        <div id='main'>
            <div id='side-menu'>
                <SideMenu />
            </div>
            <Profile />
            <div id='items-content'>
                {CheckAuth("ManageItems") ? (<h1>Hello</h1>) : (<h1>ERROR</h1>)}
            </div>
        </div>
    )
}