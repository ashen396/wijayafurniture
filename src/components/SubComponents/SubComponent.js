import { useState } from "react"
import properties from '../../properties.json'
import CheckAuth from "../BLL/CheckAuthorization"
import DataAccessLayer from "../DAL/DataAccessLayer"
import RenderAsync from "../DAL/RenderAsync"
import DynamicTable from "./DynamicTable"

export default function SubComponent({ name = toString(), authName = toString(), headers = [], reload = Boolean, hasIndex = Boolean, hideColumn = null }) {
    const url = properties["server-name"] + name
    const [, setIsReload] = useState(false)

    async function asyncFunction() {
        setIsReload(reload)

        let data = new DataAccessLayer(url)
        let retrievedData = await data.GetData()

        if (retrievedData != null)
            return retrievedData
    }

    function returnBody(headers = Array, data, i = Number, hasIndex = Boolean) {
        let body = []

        if (hasIndex)
            body[0] = i + 1

        headers.forEach((name, index, array) => {
            if (hasIndex && index === 0)
                return

            if (hideColumn !== null) {
                if (index === hideColumn) {
                    body[index] = "******"
                    return
                }
            }

            body[index] = data[i][name]
        })

        return body
    }

    return (
        <div id={"sub-" + name.toLowerCase()}>
            {CheckAuth(authName) ? (
                <RenderAsync
                    promiseFn={asyncFunction}
                    fallback="loading..."
                    render={(result) => {
                        const main = document.getElementById(name.toLowerCase())

                        //Removes all the child nodes if exists
                        if (main.childElementCount > 0) {
                            main.childNodes.forEach((childNode) => {
                                main.removeChild(childNode)
                            })
                        }

                        //Add items as children if main is empty
                        JSON.stringify(result.response, (_, value) => {
                            var i = 0
                            var holder = document.createElement("div")
                            holder.id = name.toLowerCase() + "-holder"

                            let table = new DynamicTable(name.toLowerCase() + "-table", headers)

                            while (value[i]._id != null) {
                                try {

                                    let body = returnBody(headers, value, i, hasIndex)

                                    table.SetData(value[i]._id, body)

                                    if (value[i + 1]._id != null)
                                        i++
                                }
                                catch (error) {
                                    break
                                }
                            }

                            let returned_table = table.GetData()
                            holder.appendChild(returned_table)

                            if (holder.childElementCount > 0) {
                                main.appendChild(holder)
                                document.getElementById(name.toLowerCase()).scrollTo(0, holder.clientHeight)
                            }
                            else {
                                const noData = document.createElement("h2")
                                noData.innerText = "NO DATA AVAILABLE"
                                main.appendChild(noData)
                            }
                        })
                    }} />) : ((<p>ERROR</p>))}
        </div>
    )
}