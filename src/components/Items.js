import React from 'react'
import properties from '../properties.json'
import '../styles/Items.css'
import CheckAuth from './BLL/CheckAuthorization'
import Profile from './Profile'
import SideMenu from './SideMenu'
import SubItems from './SubComponents/SubItems'

export default function Items() {
  let url = properties['server-name'] + "Items"
  const [state, setState] = React.useState(url)

  const SetData = (event) => {
    try {
      const search = document.getElementById("item-search-input").value

      if ((event.code === 'Enter' || event.keyCode === 13 || event.type === "click")) {
        if (search.length === 0)
          setState(url)
        else
          setState(url + "/?ItemCode=" + String(search).toLowerCase())
      }
    } catch (err) {
      alert(err)
    }
  }

  return (
    <div id='main'>
      <div id='side-menu'>
        <SideMenu />
      </div>
      <Profile />
      <div id='items-content'>
        {CheckAuth("Items") ? (
          <div className='align-items-center' id='items-content-holder'>
            <div className='row g-3' id='search-holder'>
              <div className='col-md-3'>
                <input className='form-control' id='item-search-input' type='text' placeholder='Search...' onKeyDown={(e) => SetData(e)} />
              </div>
              <div className='col-md-3'>
                <button className='btn btn-primary mb-2r' id='item-search-button' type='submit' onClick={(e) => SetData(e)}>Search</button>
              </div>
            </div>
            <div>
              <SubItems id='subitems' url={state} />
            </div>
          </div>) : (<h1>Error</h1>)}
      </div>
    </div>
  )
  // <p id='add-items'>Add Items</p>
}