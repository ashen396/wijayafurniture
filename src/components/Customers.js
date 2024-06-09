import { useState } from 'react';
import properties from '../properties.json';
import CheckAuth from './BLL/CheckAuthorization';
import DataAccessLayer from './DAL/DataAccessLayer';
import Profile from './Profile';
import SideMenu from './SideMenu';
import SubComponent from './SubComponents/SubComponent';

//Create a customer in the database
async function SaveData() {

  const url = properties['server-name'] + "Customers"
  const docNic = String(document.getElementById("nic").value)
  const docName = String(document.getElementById("name").value)
  const docContact = String(document.getElementById("contact").value)
  const docAddress = String(document.getElementById("address").value)

  if (docNic.length === 0) {
    alert("Nic cannot be null")
    return
  }

  if (docName.length === 0) {
    alert("Name cannot be null")
    return
  }

  if (docContact.length === 0) {
    alert("Contact cannot be null")
    return
  }

  if (docAddress.length === 0) {
    alert("Address cannot be null")
    return
  }

  let new_customer = {
    "NIC": docNic,
    "Name": docName,
    "Contact": docContact,
    "Address": docAddress
  }

  let data = new DataAccessLayer(url)
  data.Insert(new_customer).then((result) => {
    if (result !== undefined) {
      document.getElementById("nic").value = null
      document.getElementById("name").value = null
      document.getElementById("contact").value = null
      document.getElementById("address").value = null
    }
    else {
      alert("Error!")
    }
  })
}

export default function Customers() {

  const [reload, setReload] = useState(false)

  return (
    <div id='main'>
      <div id='side-menu'>
        <SideMenu />
      </div>
      <Profile />

      <div id='content'>
        {CheckAuth("Customers") ? (
          <div id='customers-holder'>
            <div id='customers'>
              <SubComponent name='Customers' authName="Customers" headers={["Index", "NIC", "Name", "Contact", "Address"]} reload={reload} hasIndex={true} />
            </div>

            <div className='row g-3' id='form'>
              <div className='row g-3'>
                <div className='col-md-3'>
                  <input className='form-control' name='nic' id='nic' placeholder='National Identity Card' />
                </div>
                <div className='col-md-3'>
                  <input className='form-control' name='name' id='name' placeholder='Full Name' />
                </div>
              </div>
              <div className='row g-3'>
                <div className='col-md-3'>
                  <input className='form-control' name='contact' id='contact' placeholder='Contact' />
                </div>
                <div className='col-md-3'>
                  <input className='form-control' name='address' id='address' placeholder='Address' />
                </div>
              </div>
              <div className='row g-3'>
                <div className='col-md-5'>
                  <button className='btn btn-primary mb-2r' type='button' onClick={() => { SaveData(); setReload(!reload) }}>Save</button>
                </div>
              </div>
            </div>
          </div>) : (<h1>Error</h1>)}
      </div>
    </div>
  )
}