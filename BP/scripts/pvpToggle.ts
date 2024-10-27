import * as server from '@minecraft/server'

export function pvpOn(player: server.Player) {
    player.triggerEvent("bz:pvpon")
    player.setDynamicProperty("pvp", true)
}

export function pvpOff(player: server.Player) {
    player.triggerEvent("bz:pvpoff")
    player.setDynamicProperty("pvp", false)
}