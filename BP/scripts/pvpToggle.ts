import * as server from '@minecraft/server'

export function pvpOn(player: server.Player) {
    player.triggerEvent("bz:pvpon")
}

export function pvpOff(player: server.Player) {
    player.triggerEvent("bz:pvpoff")
}