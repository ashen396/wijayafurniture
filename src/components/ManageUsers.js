import { useState } from 'react'
import properties from '../properties.json'
import '../styles/ManageUsers.css'
import CheckAuth from "./BLL/CheckAuthorization"
import DataAccessLayer from './DAL/DataAccessLayer'
import Profile from "./Profile"
import SideMenu from "./SideMenu"
import SubComponent from './SubComponents/SubComponent'

//Global Variable
let url = properties['server-name'] + "Users"

function GetMenus() {
    let menus = properties.menus
    return menus
}

function GetSelectedMenus() {
    let selectedMenus = ''
    let list = document.getElementById('menu-list-group')
    list.childNodes.forEach((node, key, parent) => {
        if (node.childNodes[0].checked)
            selectedMenus += node.childNodes[0].id + ','
    })

    if (selectedMenus.charAt(selectedMenus.length - 1) === ',')
        selectedMenus = selectedMenus.slice(0, selectedMenus.length - 1)

    if (selectedMenus !== null)
        return selectedMenus
}

async function SaveUser() {
    let menus = String(GetSelectedMenus())
    let first_name = document.getElementById("first-name").value
    let last_name = document.getElementById("last-name").value
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value

    let data = new DataAccessLayer(url)

    if (menus.endsWith(','))
        menus = menus.slice(0, menus.length - 1)

    let new_user = {
        "FirstName": first_name,
        "LastName": last_name,
        "Username": username,
        "Password": password,
        "Menus": menus
    }

    await data.Insert(new_user).then((result) => {
        if (result !== undefined || result !== null) {
            document.getElementById("first-name").value = null
            document.getElementById("last-name").value = null
            document.getElementById("username").value = null
            document.getElementById("password").value = null
            ClearUserMenus()
        }
        else {
            alert("Error!")
        }
    })
}

async function Delete(id = String, reload, setReload) {
    let data = new DataAccessLayer(url)

    let user = {
        "_id": id
    }

    await data.Delete(user).then((result) => {
        if (Number(result) > 0)
            setReload(!reload)
    })
}

function DeleteUser(reload, setReload) {
    let table = document.getElementById("users-table")
    let body = table.querySelector("tbody")

    body.childNodes.forEach((node, _) => {
        node.style.cursor = "pointer"
        node.addEventListener('click', () => Delete(node.id, reload, setReload))
    })
}

function UpdateUserMenus(selectedMenus) {
    let group = document.getElementById('menu-list-group')
    group.childNodes.forEach((node, key, parent) => {
        if (selectedMenus.includes(node.childNodes[0].id))
            node.childNodes[0].checked = true
        else
            node.childNodes[0].checked = false
    })
}

function ClearUserMenus() {
    let group = document.getElementById('menu-list-group')
    group.childNodes.forEach((node, key, parent) => {
        node.childNodes[0].checked = false
    })
}

var isSelected = false
var selectedNode = null
async function UpdateUserChange(node = Node) {
    let selected_menus = node.childNodes[5].innerText

    if (isSelected === false) {
        node.childNodes.forEach((val, ind, arr) => {
            let td = document.createElement("td")
            let input = document.createElement('input')
            input.type = 'text'
            input.className = 'form-control'
            input.value = val.innerText

            td.appendChild(input)
            val.replaceWith(td)
        })

        selectedNode = node
        document.getElementById('update-user').innerText = "Done"

        let menus_array = String(selected_menus).split(',')

        UpdateUserMenus(menus_array)
    }

    isSelected = true
}

function UpdateUser(reload, setReload) {
    if (!isSelected) {
        let table = document.getElementById("users-table")
        let body = table.querySelector("tbody")

        body.childNodes.forEach((node, _) => {
            node.style.cursor = "pointer"
            node.addEventListener('click', () => UpdateUserChange(node))
        })
    }
    else {
        Update(reload, setReload)
    }
}

async function Update(reload, setReload) {
    if (selectedNode !== null) {
        let data = new DataAccessLayer(url)
        let user_data

        if (selectedNode.children[4].children[0].value === "******") {
            user_data = {
                "Table": "Users",
                "_id": selectedNode.id,
                "FirstName": selectedNode.children[1].children[0].value,
                "LastName": selectedNode.children[2].children[0].value,
                "Username": selectedNode.children[3].children[0].value,
                "Menus": GetSelectedMenus()
            }
        }
        else {
            user_data = {
                "Table": "Users",
                "_id": selectedNode.id,
                "FirstName": selectedNode.children[1].children[0].value,
                "LastName": selectedNode.children[2].children[0].value,
                "Username": selectedNode.children[3].children[0].value,
                "Password": selectedNode.children[4].children[0].value,
                "Menus": GetSelectedMenus()
            }
        }

        let result = await data.Update(user_data)

        if (result === true) {
            setReload(!reload)
            isSelected = false
            selectedNode = null
            ClearUserMenus()
            document.getElementById('update-user').innerText = "Update"
        }
    }
}

export default function ManagerUsers() {

    const [reload, setReload] = useState(false)

    return (
        <div id='main'>
            <div id='side-menu'>
                <SideMenu />
            </div>
            <Profile />
            <div id='user-content'>
                {CheckAuth("ManageUsers") ? (
                    <div id="user-main">
                        <button className='btn btn-primary mb-2r' type='button' id='update-user' onClick={() => { UpdateUser(reload, setReload) }}>Update</button>
                        <button className='btn btn-primary mb-2r' type='button' id='delete-user' onClick={() => { DeleteUser(reload, setReload) }}>Delete</button>
                        <div id="users">
                            <SubComponent name='Users' authName="ManageUsers" headers={["Index", "FirstName", "LastName", "Username", "Password", "Menus"]} reload={reload} hasIndex={true} hideColumn={4} />
                        </div>
                        <h3>User Rights</h3>
                        <ul id="menu-list-group" className='list-group'>
                            {GetMenus().map((value, index, array) =>
                                <li key={'li' + value} className="list-group-item">
                                    <input id={value} key={'in' + value} type="checkbox" className="form-check-input" />
                                    <label key={'lbl' + value}>{value}</label>
                                </li>
                            )}
                        </ul>

                        <div id="new-user-content">
                            <div id='first-row' className='row g-3'>
                                <div className='col-md-5'>
                                    <input id='first-name' className="form-control" type="text" placeholder="First Name" />
                                </div>
                                <div className='col-md-5'>
                                    <input id='last-name' className="form-control" type="text" placeholder="Last Name" />
                                </div>
                            </div>
                            <div id='second-row' className='row g-3'>
                                <div className='col-md-5'>
                                    <input id='username' className="form-control" type="text" placeholder="Username" />
                                </div>
                                <div className='col-md-5'>
                                    <input id='password' className="form-control" type="text" placeholder="Password" />
                                </div>
                            </div>
                            <div className='row g-3'>
                                <button className='btn btn-primary mb-2r' type='button' onClick={() => { SaveUser(); setReload(!reload) }}>Submit</button>
                            </div>
                        </div>
                    </div>
                ) : (<h1>ERROR</h1>)}
            </div>
        </div>
    )
}