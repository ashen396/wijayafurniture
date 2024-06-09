import { useState } from 'react';
import properties from '../properties.json';
import '../styles/Customers.css';
import CheckAuth from './BLL/CheckAuthorization';
import DataAccessLayer from './DAL/DataAccessLayer';
import Profile from './Profile';
import SideMenu from './SideMenu';
import SubComponent from './SubComponents/SubComponent';

//Global variable
const url = properties['server-name'] + "Customers"

//Create a customer in the database
async function SaveData() {

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

async function Delete(id = String, reload, setReload) {
    let data = new DataAccessLayer(url)

    let customer = {
        "_id": id
    }

    await data.Delete(customer).then((result) => {
        if (Number(result) > 0)
            setReload(!reload)
    })
}

function DeleteCustomer(reload, setReload) {
    let table = document.getElementById("customers-table")
    let body = table.querySelector("tbody")

    body.childNodes.forEach((node, _) => {
        node.style.cursor = "pointer"
        node.addEventListener('click', () => Delete(node.id, reload, setReload))
    })
}

var isSelected = false
var selectedNode = null
async function UpdateCustomerChange(node = Node) {

    if (isSelected === false)
        node.childNodes.forEach((val, ind, arr) => {
            let td = document.createElement("td")
            let input = document.createElement('input')
            input.type = 'text'
            input.className = 'form-control'
            input.value = val.innerText

            td.appendChild(input)
            val.replaceWith(td)
        })

    isSelected = true
    selectedNode = node
    document.getElementById('update-customer').innerText = "Done"
}

function UpdateCustomer(reload, setReload) {
    if (!isSelected) {
        let table = document.getElementById("customers-table")
        let body = table.querySelector("tbody")

        body.childNodes.forEach((node, _) => {
            node.style.cursor = "pointer"
            node.addEventListener('click', () => UpdateCustomerChange(node))
        })
    }
    else {
        Update(reload, setReload)
    }
}

async function Update(reload, setReload) {
    if (selectedNode !== null) {
        let data = new DataAccessLayer(url)

        let customer_data = {
            "Table": "Customer",
            "_id": selectedNode.id,
            "NIC": selectedNode.children[1].children[0].value,
            "Name": selectedNode.children[2].children[0].value,
            "Contact": selectedNode.children[3].children[0].value,
            "Address": selectedNode.children[4].children[0].value
        }

        let result = await data.Update(customer_data)

        if (result === true) {
            setReload(!reload)
            isSelected = false
            selectedNode = null
            document.getElementById('update-customer').innerText = "Update"
        }
    }
}

export default function ManageCustomers() {

    const [reload, setReload] = useState(false)

    return (
        <div id='main'>
            <div id='side-menu'>
                <SideMenu />
            </div>
            <Profile />

            <div id='content'>
                {CheckAuth("Customers") ? (
                    <div id='mng-customers-holder'>
                        <button className='btn btn-primary mb-2r' type='button' id='update-customer' onClick={() => { UpdateCustomer(reload, setReload) }}>Update</button>
                        <button className='btn btn-primary mb-2r' type='button' id='delete-customer' onClick={() => { DeleteCustomer(reload, setReload) }}>Delete</button>
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