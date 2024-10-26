import * as server from '@minecraft/server'

export function isCombatLog(player: server.Player) {
    const combatLog = player.getDynamicProperty("combatLog") as number
    if (combatLog < 600) {
        return true
    }
    return false
}