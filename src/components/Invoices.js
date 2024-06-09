import '../styles/Sales.css';
import CheckAuth from './BLL/CheckAuthorization';
import Profile from "./Profile";
import SideMenu from "./SideMenu";

export default function Invoices() {
    return (
        <div id='main'>
            <div id='side-menu'>
                <SideMenu />
            </div>
            <Profile />
            {CheckAuth("Invoices") ? (
                <h1>Invoices</h1>) : (<h1>Error</h1>)}
        </div>
    )
}