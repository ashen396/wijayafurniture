let table, table_body
function CreateTable(id = String, props = Array['']) {
    table = document.createElement("table")
    table.id = id
    table.className = "table table-dark table-borderless"

    let head = document.createElement("thead")
    head.style.position = "Sticky"
    head.style.top = 0

    let tr = document.createElement("tr")
    props.map((val, ind, arr) => {
        let th = document.createElement("th")
        th.scope = "col"
        th.innerText = val

        return tr.appendChild(th)
    })

    head.appendChild(tr)
    table.appendChild(head)

    table_body = document.createElement("tbody")
}

function AppendData(id = String, props = Array['']) {
    let tr = document.createElement("tr")
    tr.id = id

    props.map((val, ind, arr) => {
        let td = document.createElement("td")
        td.innerText = val;

        return tr.appendChild(td)
    })

    table_body.appendChild(tr)
}

function ReturnTable() {
    table.appendChild(table_body)
    return table
}

export default class SubCustomersTable {
    constructor(id = String, props = Array['']) {
        CreateTable(id, props)
    }

    SetData(id = String, props = Array['']) {
        AppendData(id, props)
    }

    GetData() {
        return ReturnTable()
    }
}