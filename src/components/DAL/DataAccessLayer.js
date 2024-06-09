import timeout from "../BLL/Timeout"

async function GetData(url = String) {
    let retrievedData = null
    await fetch(url).then((resp) => { retrievedData = resp.json() }).catch((err) => { console.log("Error: " + err) })
    await timeout(1000)
    return retrievedData
}

async function ReturnData(url = String, data) {
    let retrievedData = null
    await fetch(url, {
        "method": "GET",
        "headers": {
            "authorization": data.username + ':' + data.password
        }
    }).then((resp) => { retrievedData = resp.json() }).catch((err) => { console.log("Error: " + err) })
    await timeout(1000)
    return retrievedData
}

async function InsertData(url = String, data) {
    let result
    await fetch(url, {
        "method": "POST",
        body: JSON.stringify(data)
    }).then((value) => {
        value.text().then((resp) => {
            result = resp
        }).catch((err) => {
            alert(err)
            console.log(err)
        })
    })

    await timeout(1000)
    return result
}

async function UpdateData(url = String, data) {
    let result = null
    await fetch(url, {
        "method": "PUT",
        body: JSON.stringify(data)
    }).then((resp) => {
        result = resp.status
    }).catch((err) => { console.log("Error: " + err) });

    if (result === 200)
        return true

    await timeout(1000)
    return false
}

async function DeleteData(url = String, data) {
    let result = null

    await fetch(url, {
        "method": "DELETE",
        body: JSON.stringify(data)
    }).then((resp) =>
        resp.text().then((value) => {
            result = value
        })).catch((err) => { console.log("Error: " + err) });

    await timeout(1000)
    return result
}

var dal_url = null
export default class DataAccessLayer {
    constructor(url = String) {
        dal_url = url
    }

    async GetData() {
        return GetData(dal_url)
    }

    async AuthenticateUser(data) {
        return ReturnData(dal_url, data)
    }

    async Insert(data) {
        return InsertData(dal_url, data)
    }

    async Update(data) {
        return UpdateData(dal_url, data)
    }

    async Delete(data) {
        return DeleteData(dal_url, data)
    }
}