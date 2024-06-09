import React, { useState } from 'react';
import properties from '../../properties.json';
import CheckAuth from '../BLL/CheckAuthorization';
import DataAccessLayer from '../DAL/DataAccessLayer';
import RenderAsync from '../DAL/RenderAsync';
import ReturnItems from './ItemComponent';
import Loading from './Loading';

export default function SubItems({ url = String }) {
  let con_url = properties['server-name'] + "Items"
  const [getURL, setURL] = useState(con_url)

  async function asyncFunction() {
    if (url.length > 0) {
      setURL(url)

      let data = new DataAccessLayer(getURL)
      let retrievedData = await data.GetData()

      if (retrievedData != null)
        return retrievedData
    }
  }

  return (
    <div id='subitems'>
      {CheckAuth("Items") ? (
        <RenderAsync
          promiseFn={asyncFunction}
          fallback={<Loading />}
          render={(result) => {

            const main = document.getElementById("subitems");

            //Removes all the child nodes if exists
            if (main.childElementCount > 0) {
              if (main.children[0].id !== "loading-overlay") {
                main.childNodes.forEach((childNode, _key, _parent) => {
                  main.removeChild(childNode)
                })
              }
            }

            //Add items as children if main is empty
            JSON.stringify(result.response, (_, value) => {
              var i = 0
              const holder = document.createElement("div")
              holder.id = "div-holder"

              if (value[i]._id !== undefined) {
                while (value[i]._id != null) {
                  try {
                    const bodyResult = ReturnItems(value[i].ItemCode, value[i].Image, value[i].Name, value[i].Quantity, value[i].Price,
                      value[i].Discount, value[i].Category, value[i].Supplier, value[i].DOE, value[i].Size, value[i].Weight)

                    holder.appendChild(bodyResult)

                    if (value[i + 1]._id != null)
                      i++;
                  }
                  catch (error) {
                    break;
                  }
                }
              }
              else {
                const data = document.createElement("h1")
                data.innerText = "NO ITEM FOUND"
                holder.appendChild(data)
              }

              if (holder.childElementCount > 0)
                main.appendChild(holder)

            })
          }} />) : (<p>ERROR</p>)}
    </div>
  )
}