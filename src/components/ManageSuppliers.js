import { useState } from 'react'
import properties from '../properties.json'
import '../styles/Suppliers.css'
import CheckAuth from "./BLL/CheckAuthorization"
import DataAccessLayer from './DAL/DataAccessLayer'
import Profile from "./Profile"
import SideMenu from "./SideMenu"
import SubComponent from './SubComponents/SubComponent'

//Global Variable
const url = properties['server-name'] + "Suppliers"

//Add new supplier
async function SaveData() {
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
        "Name": name,
        "Category": category,
        "Contact": contact,
        "Address": address
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


async function Delete(id = String, reload, setReload) {
    let data = new DataAccessLayer(url)

    let supplier = {
        "_id": id
    }

    await data.Delete(supplier).then((result) => {
        if (Number(result) > 0)
            setReload(!reload)
    })
}

function DeleteSupplier(reload, setReload) {
    let table = document.getElementById("suppliers-table")
    let body = table.querySelector("tbody")

    body.childNodes.forEach((node, _) => {
        node.style.cursor = "pointer"
        node.addEventListener('click', () => Delete(node.id, reload, setReload))
    })
}

var isSelected = false
var selectedNode = null
async function UpdateSupplierChange(node = Node) {

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
    document.getElementById('update-supplier').innerText = "Done"
}

function UpdateSupplier(reload, setReload) {
    if (!isSelected) {
        let table = document.getElementById("suppliers-table")
        let body = table.querySelector("tbody")

        body.childNodes.forEach((node, _) => {
            node.style.cursor = "pointer"
            node.addEventListener('click', () => UpdateSupplierChange(node))
        })
    }
    else {
        Update(reload, setReload)
    }
}

async function Update(reload, setReload) {
    if (selectedNode !== null) {
        let data = new DataAccessLayer(url)

        let supplier_data = {
            "Table": "Suppliers",
            "_id": selectedNode.id,
            "Name": selectedNode.children[1].children[0].value,
            "Category": selectedNode.children[2].children[0].value,
            "Contact": selectedNode.children[3].children[0].value,
            "Address": selectedNode.children[4].children[0].value
        }

        let result = await data.Update(supplier_data)

        if (result === true) {
            setReload(!reload)
            isSelected = false
            selectedNode = null
            document.getElementById('update-supplier').innerText = "Update"
        }
    }
}


export default function ManageSuppliers() {

    const [reload, setReload] = useState(false)

    return (
        <div id='main'>
            <div id='side-menu'>
                <SideMenu />
            </div>
            <Profile />

            <div id='content'>
                {CheckAuth("Suppliers") ? (
                    <div id='mng-suppliers-holder'>
                        <button className='btn btn-primary mb-2r' type='button' id='update-supplier' onClick={() => { UpdateSupplier(reload, setReload) }}>Update</button>
                        <button className='btn btn-primary mb-2r' type='button' id='delete-supplier' onClick={() => { DeleteSupplier(reload, setReload) }}>Delete</button>
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