import { useState } from 'react'
import properties from '../properties.json'
import '../styles/Suppliers.css'
import CheckAuth from "./BLL/CheckAuthorization"
import DataAccessLayer from './DAL/DataAccessLayer'
import Profile from "./Profile"
import SideMenu from "./SideMenu"
import SubComponent from './SubComponents/SubComponent'

//Add new supplier
async function SaveData() {

    const url = properties['server-name'] + "Suppliers"
    const name = String(document.getElementById("supplier-name-input").value)
    const category = String(document.getElementById("category-type-input").value)
    const contact = String(document.getElementById("supplier-contact-input").value)
    const address = String(document.getElementById("supplier-address-input").value)

    if (name.length === 0) {
        alert("Name cannot be null")
        return
    }

    if (category.length === 0) {
        alert("Category type cannot be null")
        return
    }

    if (contact.length === 0) {
        alert("Contact number cannot be null")
        return
    }

    if (address.length === 0) {
        alert("Supplier address cannot be null")
        return
    }

    let new_supplier = {
        name: name,
        category: category,
        contact: contact,
        address: address
    }

    let data = new DataAccessLayer(url)
    data.Insert(new_supplier).then((result) => {
        if (result !== undefined) {
            document.getElementById("supplier-name-input").value = null
            document.getElementById("category-type-input").value = null
            document.getElementById("supplier-contact-input").value = null
            document.getElementById("supplier-address-input").value = null
        }
        else {
            alert("Error!")
        }
    })
}

export default function Suppliers() {

    const [reload, setReload] = useState(false)

    return (
        <div id='main'>
            <div id='side-menu'>
                <SideMenu />
            </div>
            <Profile />

            <div id='content'>
                {CheckAuth("Suppliers") ? (
                    <div>
                        <div id='suppliers'>
                            <SubComponent name='Suppliers' authName="Suppliers" headers={["Index", "Name", "Category", "Contact", "Address"]} reload={reload} hasIndex={true} />
                        </div>

                        <div id="supplier-holder" className='d-flex align-items-center justify-content-center row g-3'>
                            <div className='col-md-3'>
                                <input id='supplier-name-input' className='form-control' type='text' placeholder='Supplier Name' />
                                <input id='category-type-input' className='form-control' type='text' placeholder='Category' />
                            </div>

                            <div className='col-md-3'>
                                <input id='supplier-contact-input' className='form-control' type='text' placeholder='Contact Number' />
                                <input id='supplier-address-input' className='form-control' type='text' placeholder='Supplier Address' />
                            </div>

                            <div className='col-md-3'>
                                <button className='btn btn-primary mb-2r' id='add-supplier-button' type='submit' onClick={() => { SaveData(); setReload(!reload) }}>Save</button>
                            </div>
                        </div>
                    </div>
                ) : (<h1>Error</h1>)}
            </div>
        </div>
    )
}