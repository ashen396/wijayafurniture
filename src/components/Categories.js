import { useState } from 'react'
import properties from '../properties.json'
import '../styles/Categories.css'
import CheckAuth from "./BLL/CheckAuthorization"
import DataAccessLayer from './DAL/DataAccessLayer'
import Profile from "./Profile"
import SideMenu from "./SideMenu"
import SubComponent from './SubComponents/SubComponent'

//Create a new category type
async function SaveData() {

    const url = properties['server-name'] + "Categories"
    const category = String(document.getElementById("new-category-input").value)


    if (category.length === 0) {
        alert("Category type cannot be null")
        return
    }

    let new_category = {
        category: category
    }

    let data = new DataAccessLayer(url)
    data.Insert(new_category).then((result) => {
        if (result !== undefined) {
            document.getElementById("new-category-input").value = null
        }
        else {
            alert("Error!")
        }
    })
}

export default function Categories() {

    const [reload, setReload] = useState(false)

    return (
        <div id='main'>
            <div id='side-menu'>
                <SideMenu />
            </div>
            <Profile />

            <div id='content'>
                {CheckAuth("Categories") ? (
                    <div>
                        <div id='categories'>
                            <SubComponent name='Categories' authName='Categories' headers={["Index", "Category"]} reload={reload} hasIndex={true} />
                        </div>

                        <div id="categories-holder" className='d-flex align-items-center justify-content-center row g-3'>
                            <div className='col-md-3'>
                                <input id='new-category-input' className='form-control' type='text' placeholder='Category Name' />
                            </div>

                            <div className='col-md-3'>
                                <button className='btn btn-primary mb-2r' id='new-category-button' type='submit' onClick={() => { SaveData(); setReload(!reload) }}>ADD</button>
                            </div>
                        </div>
                    </div>
                ) : (<h1>Error</h1>)}
            </div>
        </div>
    )
}