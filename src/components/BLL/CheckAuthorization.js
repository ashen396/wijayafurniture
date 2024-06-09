import CryptoJS from 'crypto-js'
import { useCookies } from 'react-cookie'

export default function CheckAuth(page = String) {
    const user = useCookies(['user'])[0].user
    const menu_list = localStorage.getItem("Menus")

    if (menu_list === null)
        return

    const menus_decrypted = CryptoJS.AES.decrypt(menu_list, user).toString(CryptoJS.enc.Utf8)

    let menus = null
    if (menus_decrypted !== null)
        if (menus_decrypted.length > 0)
            menus = menus_decrypted.split(',')

    if (menus !== null)
        if (menus.includes(page))
            return true

    return false
}