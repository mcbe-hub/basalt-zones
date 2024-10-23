import { Player } from '@minecraft/server'

export function joinSetup(player: Player) {
    if (player.getDynamicProperty("elo") == undefined) player.setDynamicProperty("elo", 1000)
    if (player.getDynamicProperty("money") == undefined) player.setDynamicProperty("money", 0)
    if (player.getDynamicProperty("totalMoney") == undefined) player.setDynamicProperty("totalMoney", 0)
    if (player.getDynamicProperty("kills") == undefined) player.setDynamicProperty("kills", 0)
    if (player.getDynamicProperty("deaths") == undefined) player.setDynamicProperty("deaths", 0)
    if (player.getDynamicProperty("combatLog") == undefined) player.setDynamicProperty("combatLog", 0)
}