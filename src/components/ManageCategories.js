import { useState } from 'react';
import properties from '../properties.json';
import CheckAuth from './BLL/CheckAuthorization';
import DataAccessLayer from './DAL/DataAccessLayer';
import Profile from './Profile';
import SideMenu from './SideMenu';
import SubComponent from './SubComponents/SubComponent';

//Global variable
const url = properties['server-name'] + "Categories"

//Create a customer in the database
async function SaveData() {

    const category = String(document.getElementById("category").value)

    if (category.length === 0) {
        alert("Category cannot be null")
        return
    }

    let new_category = {
        "Category": category
    }

    let data = new DataAccessLayer(url)
    data.Insert(new_category).then((result) => {
        if (result !== undefined) {
            document.getElementById("category").value = null
        }
        else {
            alert("Error!")
        }
    })
}

async function Delete(id = String, reload, setReload) {
    let data = new DataAccessLayer(url)

    let category = {
        "_id": id
    }

    await data.Delete(category).then((result) => {
        if (Number(result) > 0)
            setReload(!reload)
    })
}

function DeleteCategories(reload, setReload) {
    let table = document.getElementById("categories-table")
    let body = table.querySelector("tbody")

    body.childNodes.forEach((node, _) => {
        node.style.cursor = "pointer"
        node.addEventListener('click', () => Delete(node.id, reload, setReload))
    })
}

var isSelected = false
var selectedNode = null
async function UpdateCategoriesChange(node = Node) {

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
    document.getElementById('update-categories').innerText = "Done"
}

function UpdateCategories(reload, setReload) {
    if (!isSelected) {
        let table = document.getElementById("categories-table")
        let body = table.querySelector("tbody")

        body.childNodes.forEach((node, _) => {
            node.style.cursor = "pointer"
            node.addEventListener('click', () => UpdateCategoriesChange(node))
        })
    }
    else {
        Update(reload, setReload)
    }
}

async function Update(reload, setReload) {
    if (selectedNode !== null) {
        let data = new DataAccessLayer(url)

        let category_data = {
            "Table": "Categories",
            "_id": selectedNode.id,
            "Category": selectedNode.children[1].children[0].value
        }

        let result = await data.Update(category_data)

        if (result === true) {
            setReload(!reload)
            isSelected = false
            selectedNode = null
            document.getElementById('update-categories').innerText = "Update"
        }
    }
}

export default function ManageCategories() {

    const [reload, setReload] = useState(false)

    return (
        <div id='main'>
            <div id='side-menu'>
                <SideMenu />
            </div>
            <Profile />

            <div id='content'>
                {CheckAuth("Categories") ? (
                    <div id='mng-categories-holder'>
                        <button className='btn btn-primary mb-2r' type='button' id='update-categories' onClick={() => { UpdateCategories(reload, setReload) }}>Update</button>
                        <button className='btn btn-primary mb-2r' type='button' id='delete-categories' onClick={() => { DeleteCategories(reload, setReload) }}>Delete</button>
                        <div id='categories'>
                            <SubComponent name='Categories' authName='Categories' headers={["Index", "Category"]} reload={reload} hasIndex={true} />
                        </div>

                        <div className='row g-3' id='form'>
                            <div className='row g-3'>
                                <div className='col-md-3'>
                                    <input className='form-control' name='category' id='category' placeholder='Category' />
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