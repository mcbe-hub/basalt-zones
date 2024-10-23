import * as server from '@minecraft/server'
import { ActionFormData, ModalFormResponse } from '@minecraft/server-ui'
import { addMoney, payMoney } from './main.js'

function hasEnoughMoney(player: server.Player, amount: number) {
    const money = player.getDynamicProperty("money") as number
    if (money >= amount) return true
    return false
}

export function mainShopUi(player: server.Player) {
    new ActionFormData()
        .title("Sklep")
        .body("\nWitaj w sklepie serwerowym! Wybierz kategorię jaka cię interesuje:\n ")
        .button("Enchanty", "textures/items/book_enchanted.png")
        .button("Dodatkowe Itemy", "textures/items/feather.png")
        .button("Kopanie", "textures/items/diamond_pickaxe.png")
        .show(player).then(data => {
            if (!data.canceled) {
                switch (data.selection) {
                    case 0:
                        enchantShop(player)
                        break;
                }
            }
        })
}

function enchantShop(player: server.Player) {

}