import '../../styles/SubItems.css'

export default function ReturnItems(itemcode = String, image = Image, name = String, qty = Number, price = Number, discount = Number, category = String, supplier = String, expdate = Date, size = String, weight = Number) {

    const div = document.createElement("div")
    div.className = 'items card shadow-sm'

    const table = document.createElement("table")

    const tr = document.createElement("tr")

    const td = document.createElement("td")

    const img = document.createElement("img")
    img.className = 'item-img'
    img.alt = name
    img.src = require('../../images/' + image + '.jpeg')
    td.appendChild(img)

    const sectd = document.createElement("td")
    sectd.rowSpan = 2

    const sectable = document.createElement("table")
    sectable.id = "table-desc"
    sectable.border = 1

    //First Row - Item Headings
    const firTr = document.createElement("tr")

    const firTHItemName = document.createElement("th")
    firTHItemName.innerText = "Item Name"

    const firTHItemRem = document.createElement("th")
    firTHItemRem.innerText = "Items Remaining"

    const firTHPrice = document.createElement("th")
    firTHPrice.innerText = "Price"

    const firTHDisc = document.createElement("th")
    firTHDisc.innerText = "Discount Available"

    const firTHCat = document.createElement("th")
    firTHCat.innerText = "Category"

    //Second Row - Heading Item Details
    const sectr = document.createElement("tr")

    const secthItemName = document.createElement("td")
    const secpItemName = document.createElement("p")
    secpItemName.innerText = name
    secthItemName.appendChild(secpItemName)

    const secthItemRem = document.createElement("td")
    const secpItemRem = document.createElement("p")
    secpItemRem.innerText = qty
    secthItemRem.appendChild(secpItemRem)

    const secthPrice = document.createElement("td")
    const secpPrice = document.createElement("p")
    secpPrice.innerText = "Rs." + price
    secthPrice.appendChild(secpPrice)

    const secthDisc = document.createElement("td")
    const secpDisc = document.createElement("p")
    secpDisc.innerText = discount + '%'
    secthDisc.appendChild(secpDisc)

    const secthCat = document.createElement("td")
    const secpCat = document.createElement("p")
    secpCat.innerText = category
    secthCat.appendChild(secpCat)

    //Third Row - Heading Items
    const thirtr = document.createElement("tr")

    const thirthItemName = document.createElement("th")
    thirthItemName.innerText = "Supplier"

    const thirthItemRem = document.createElement("th")
    thirthItemRem.innerText = "Warranty Period"

    const thirthPrice = document.createElement("th")
    thirthPrice.colSpan = 2
    thirthPrice.innerText = "Size"

    const thirthDisc = document.createElement("th")
    thirthDisc.innerText = "Weight"


    //Third Row - Heading Item Details
    const fourtr = document.createElement("tr")

    const fourthItemName = document.createElement("td")
    const fourpItemName = document.createElement("p")
    fourpItemName.innerText = supplier
    fourthItemName.appendChild(fourpItemName)

    const fourthItemRem = document.createElement("td")
    const fourpItemRem = document.createElement("p")
    fourpItemRem.innerText = expdate.toString().substring(0, 10)
    fourthItemRem.appendChild(fourpItemRem)

    const fourthPrice = document.createElement("td")
    const fourpPrice = document.createElement("p")
    fourthPrice.colSpan = 2
    fourpPrice.innerText = size
    fourthPrice.appendChild(fourpPrice)

    const fourthDisc = document.createElement("td")
    const fourpDisc = document.createElement("p")
    fourpDisc.innerText = weight
    fourthDisc.appendChild(fourpDisc)

    const itemcodetr = document.createElement("tr")
    const itemcodetd = document.createElement("td")
    itemcodetd.innerText = itemcode
    itemcodetd.id = "item-code"

    sectable.appendChild(firTr)
    firTr.appendChild(firTHItemName)
    firTr.appendChild(firTHItemRem)
    firTr.appendChild(firTHPrice)
    firTr.appendChild(firTHDisc)
    firTr.appendChild(firTHCat)

    sectable.appendChild(sectr)
    sectr.appendChild(secthItemName)
    sectr.appendChild(secthItemRem)
    sectr.appendChild(secthPrice)
    sectr.appendChild(secthDisc)
    sectr.appendChild(secthCat)

    sectable.appendChild(thirtr)
    thirtr.appendChild(thirthItemName)
    thirtr.appendChild(thirthItemRem)
    thirtr.appendChild(thirthPrice)
    thirtr.appendChild(thirthDisc)

    sectable.appendChild(thirtr)
    thirtr.appendChild(thirthItemName)
    thirtr.appendChild(thirthItemRem)
    thirtr.appendChild(thirthPrice)
    thirtr.appendChild(thirthDisc)

    sectable.appendChild(fourtr)
    fourtr.appendChild(fourthItemName)
    fourtr.appendChild(fourthItemRem)
    fourtr.appendChild(fourthPrice)
    fourtr.appendChild(fourthDisc)

    sectd.appendChild(sectable)

    tr.appendChild(td)
    tr.appendChild(sectd)

    itemcodetr.appendChild(itemcodetd)

    table.appendChild(tr)
    table.appendChild(itemcodetr)

    div.appendChild(table)

    return div
}