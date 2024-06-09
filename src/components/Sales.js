import { useState } from 'react'
import { useCookies } from 'react-cookie'
import properties from '../properties.json'
import '../styles/Sales.css'
import CheckAuth from './BLL/CheckAuthorization'
import DataAccessLayer from './DAL/DataAccessLayer'
import Profile from './Profile'
import SideMenu from './SideMenu'

async function SaveItems(user) {
    try {
        let url = properties['server-name'] + "Sales"
        let item_name = document.getElementById('item-selector').selectedOptions[0].innerText

        //Inserts to the Sales collection
        let new_data = {
            "Table": "Sales",
            "ItemCode": document.getElementById('item-selector').value,
            "ItemName": item_name,
            "Category": document.getElementById('category-selector').value,
            'Quantity': parseInt(-document.getElementById('item-count').value),
            "Remaining": 0,
            "Customer": "",
            "Seller": user,
            "DateTime": Date.now().toString()
        }

        //Update item count in the items table

        let data = new DataAccessLayer(url)
        let result = await data.Insert(new_data)

        if (!result)
            alert("Error Occurred While Processing! Please Contact IT Admin")
    }catch(err){
        alert(err)
    }
}

async function GetOptions(setOptions) {
    let category_url = properties["server-name"] + "Categories"
    let data = new DataAccessLayer(category_url)

    await data.GetData().then((result) => {
        setOptions(result)
        document.getElementById('category-selector').childNodes[0].remove()
    })
}

async function GetItems(setItems) {
    let items_url = properties["server-name"] + "Items"
    let data = new DataAccessLayer(items_url)

    await data.GetData().then((result) => {
        setItems(result)
        document.getElementById('item-selector').childNodes[0].remove()
    })
}

export default function Sales() {
    const [options, setOptions] = useState([])
    const [items, setItems] = useState([])
    const user = useCookies(['user'])[0].user

    return (
        <div id='main' onLoad={() => { GetOptions(setOptions); GetItems(setItems) }}>
            <div id='side-menu'>
                <SideMenu />
            </div>
            <Profile />
            <div id='sales-content' className='d-flex align-items-center justify-content-center'>
                {CheckAuth("Sales") ? (
                    <div id='sales-content-holder'>
                        <p>Category</p>
                        <select id='category-selector' className='form-select form-select-sm'>
                            <option>-</option>
                            {options.map((value, index, array) =>
                                <option key={value.Category} value={value.Category}>{value.Category}</option>
                            )}
                        </select>

                        <p>Item</p>
                        <select id='item-selector' className='form-select form-select-sm'>
                            <option>-</option>
                            {items.map((value, index, array) =>
                                <option key={value.ItemCode} value={value.ItemCode}>{value.Name}</option>
                            )}
                        </select>

                        <input className='form-control' id='item-count' type='text' placeholder='Item Count' />

                        <button className='btn btn-primary mb-2r' onClick={() => SaveItems(user)}>Done</button>
                        <p>Add btn-close to classname</p>
                        <button type='button' className='btn-close' />
                    </div>) : (<h1>Error</h1>)}
            </div>
        </div>
    )
}