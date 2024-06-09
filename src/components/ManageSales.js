import Profile from "./Profile"
import SideMenu from "./SideMenu"

export default function ManageSales() {
    return (
        <div id='main'>
            <div id='side-menu'>
                <SideMenu />
            </div>
            <Profile />
        </div>
    )
}