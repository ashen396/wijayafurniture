import properties from '../../properties.json';
import '../../styles/SideMenu.css';
import GetMenus from "../BLL/GetMenus";

function GetLocation() {
    let location_address = window.location.pathname
    let location = location_address.slice(1, location_address.length)
    return location
}

export default function SideMenuComponent() {
    const menuItems = properties.menus

    let menus = GetMenus()
    let location = GetLocation()
    let items = null

    if (menus != null)
        if (menus.length > 0) {
            items = menuItems.map((val) => {
                if (menus.includes(val)) {
                    if (location === val.toLowerCase())
                        return <a key={val} href={'/' + val.toLowerCase()}><li id='MenuSelected' key={val}>{val}</li></a>
                    else
                        return <a key={val} href={'/' + val.toLowerCase()}><li key={val}>{val}</li></a>
                }
                return null
            })
        }
    return (
        <ul>
            {items}
        </ul>
    )
}