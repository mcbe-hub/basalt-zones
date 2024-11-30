import { Player } from '@minecraft/server'

export function joinSetup(player: Player) {
    if (player.getDynamicProperty("elo") == undefined) player.setDynamicProperty("elo", 1000)
    if (player.getDynamicProperty("money") == undefined) player.setDynamicProperty("money", 0)
    if (player.getDynamicProperty("totalMoney") == undefined) player.setDynamicProperty("totalMoney", 0)
    if (player.getDynamicProperty("kills") == undefined) player.setDynamicProperty("kills", 0)
    if (player.getDynamicProperty("deaths") == undefined) player.setDynamicProperty("deaths", 0)
    if (player.getDynamicProperty("combatLog") == undefined) player.setDynamicProperty("combatLog", 600)
    if (player.getDynamicProperty("haste") == undefined) player.setDynamicProperty("haste", 0)
    if (player.getDynamicProperty("pickaxe") == undefined) player.setDynamicProperty("pickaxe", 0)
    if (player.getDynamicProperty("efficiency") == undefined) player.setDynamicProperty("efficiency", 0)
    if (player.getDynamicProperty("sharpness") == undefined) player.setDynamicProperty("sharpness", 0)
    if (player.getDynamicProperty("protection") == undefined) player.setDynamicProperty("protection", 0)
    if (player.getDynamicProperty("mending") == undefined) player.setDynamicProperty("mending", 0)
    if (player.getDynamicProperty("unbreaking") == undefined) player.setDynamicProperty("unbreaking", 0)
    if (player.getDynamicProperty("power") == undefined) player.setDynamicProperty("power", 0)
    if (player.getDynamicProperty("fireAspect") == undefined) player.setDynamicProperty("fireAspect", 0)
    if (player.getDynamicProperty("blink") == undefined) player.setDynamicProperty("blink", false)
    if (player.getDynamicProperty("shooter") == undefined) player.setDynamicProperty("shooter", false)
    if (player.getDynamicProperty("leap") == undefined) player.setDynamicProperty("leap", false)

    player.setDynamicProperty("pvp", false)
}