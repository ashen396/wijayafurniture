import { createServer } from 'http'
import { MongoClient, ObjectId } from "mongodb"


const connectionURL = "mongodb://127.0.0.1:27017"

async function SearchData(props = String) {
    try {
        const arrUrl = String(props).split('/')
        const selectedCollection = arrUrl[1]
        var data, jsonData

        const client = new MongoClient(connectionURL)
        const db = client.db("WijayaFurniture")
        const collection = db.collection(selectedCollection)
        client.connect()

        if (arrUrl[2] == null) {
            await collection.find().toArray().then((resData = String) => {
                client.close()
                data = resData
            })
        }
        else {
            const search = new URLSearchParams(arrUrl[2])
            const searchName = search.keys().next().value
            const searchParams = search.values().next().value
            const text = eval('(' + "{\"" + searchName + "\":{$regex:\"" + searchParams + "\", $options:\"i\"}}" + ')')
            await collection.find(text).toArray().then((resData = String) => {
                client.close()
                data = resData
            })
        }

        if (data.length === 0)
            data = JSON.parse("[{\"id\": null}]")

        jsonData = JSON.stringify(data)
        return jsonData
    }
    catch (error) {
        console.log(error)
    }
}

async function InsertData(url = String, data) {
    try {
        const arrUrl = String(url).split('/')
        const selectedCollection = arrUrl[1]

        const client = new MongoClient(connectionURL)
        const db = client.db("WijayaFurniture")
        const collection = db.collection(selectedCollection)
        client.connect()

        const result = await collection.insertOne(JSON.parse(data))
        return result.insertedId.toJSON()
    }
    catch (error) {
        console.log(error)
    }
}

async function UpdateData(url = String, data) {
    try {
        const arrUrl = String(url).split('/')
        const selectedCollection = arrUrl[1]

        const client = new MongoClient(connectionURL)
        const db = client.db("WijayaFurniture")
        const collection = db.collection(selectedCollection)
        client.connect()

        var result = null
        if (data["Table"] === "Customer") {
            result = await collection.updateOne({ "_id": new ObjectId(data["_id"]) }, { $set: { "NIC": data["NIC"], "Name": data["Name"], "Contact": data["Contact"], "Address": data["Address"] } })
        }
        else if (data["Table"] === "Categories") {
            result = await collection.updateOne({ "_id": new ObjectId(data["_id"]) }, { $set: { "Category": data["Category"] } })
        }
        else if (data["Table"] === "Suppliers") {
            result = await collection.updateOne({ "_id": new ObjectId(data["_id"]) }, { $set: { "Name": data["Name"], "Category": data["Category"], "Contact": data["Contact"], "Address": data["Address"] } })
        }
        else if (data["Table"] === "Users") {
            if (data["Password"] === undefined)
                result = await collection.updateOne({ "_id": new ObjectId(data["_id"]) }, { $set: { "FirstName": data["FirstName"], "LastName": data["LastName"], "Username": data["Username"], "Menus": data["Menus"] } })
            else
                result = await collection.updateOne({ "_id": new ObjectId(data["_id"]) }, { $set: { "FirstName": data["FirstName"], "LastName": data["LastName"], "Username": data["Username"], "Password": data["Password"], "Menus": data["Menus"] } })
        }
        else {
            if (data["UpdateType"] === "inc")
                result = await collection.updateOne({ "_id": new ObjectId(data["_id"]) }, { $inc: { "Quantity": data["Quantity"] } })
            else if (data["UpdateType"] === "set")
                result = await collection.updateOne({ "_id": new ObjectId(data["_id"]) }, { $set: { "Quantity": data["Quantity"] } })
            else
                return "Invalid Argument"
        }

        return result["modifiedCount"].toString()
    }
    catch (error) {
        console.log(error)
    }
}

async function DeleteData(url = String, data) {
    try {
        const arrUrl = String(url).split('/')
        const selectedCollection = arrUrl[1]

        const client = new MongoClient(connectionURL)
        const db = client.db("WijayaFurniture")
        const collection = db.collection(selectedCollection)
        client.connect()

        let result = await collection.deleteOne({ "_id": new ObjectId(data["_id"]) })

        return result["deletedCount"].toString()
    }
    catch (error) {
        console.log(error)
    }
}

async function AuthenticateUser(url = String, username = String, user_password = String) {
    const arrUrl = String(url).split('/')
    const selectedCollection = arrUrl[1]

    const client = new MongoClient(connectionURL)
    const db = client.db("WijayaFurniture")
    const collection = db.collection(selectedCollection)
    client.connect()

    var data = ''
    await collection.find({ "Username": username }).toArray().then((resData = String) => {
        client.close()
        data = resData
    })

    if (data != undefined || data != null) {
        if (data.length === 1) {
            const password = String(data[0]['Password'])
            if (password === user_password) {
                return {
                    "Status": "Success",
                    "Message": "Login Verified",
                    "Menus": data[0]['Menus']
                }

            } else {
                return {
                    "Status": "Error",
                    "Message": "Incorrect Password"
                }
            }
        }
        else
            return {
                "Status": "Error",
                "Message": "Invalid Username"
            }
    }
}

createServer((req, res) => {
    try {

        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', '*')
        res.setHeader('Access-Control-Max-Age', 2592000)
        res.writeHead(200, { 'Content-Type': 'application/json' })

        if ((req.method === "GET") && (req.headers['authorization'] !== undefined)) {
            const userpass = req.headers['authorization'].split(':')
            const username = userpass[0]
            const password = userpass[1]

            AuthenticateUser(req.url, username, password).then((result) => {
                res.write(JSON.stringify(result))
            }).finally(() => res.end())
        }

        if ((req.method === "GET") && (req.headers['authorization'] === undefined)) {
            SearchData(req.url).then((data) => {
                res.write(data)
            }).finally(() => { res.end() })
        }

        if (req.method === "POST") {
            req.on('data', (data) => {
                InsertData(req.url, String(data)).then((result) => {
                    res.write(result)
                }).finally(() => { res.end() })
            })
        }

        if (req.method === "PUT") {
            req.on('data', (data) => {
                UpdateData(req.url, JSON.parse(data)).then((result) => {
                    res.write(result)
                }).finally(() => { res.end() })
            })
        }

        if (req.method === "DELETE") {
            req.on('data', (data) => {
                DeleteData(req.url, JSON.parse(data)).then((result) => {
                    res.write(result)
                }).finally(() => { res.end() })
            })
        }
    }
    catch (error) {
        console.log(error)
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
        res.setHeader('Access-Control-Max-Age', 2592000)
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.write(error)
        res.end(error)
    }
}).listen(1234, "localhost")