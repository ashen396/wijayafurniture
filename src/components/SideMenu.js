import '../styles/SideMenu.css';
import logo from '../wijaya_logo.jpeg';
import SideMenuComponent from './SubComponents/SideMenuComponent';

export default function SideMenu() {
  return (
    <div id='menu'>
      <a href='/'><img src={logo} alt='logo' /></a>
      <div id='menu-holder'>
        <SideMenuComponent />
      </div>
      <p id='copyright-text'>Designed and Coded by Ashen</p>
    </div>
  );
}