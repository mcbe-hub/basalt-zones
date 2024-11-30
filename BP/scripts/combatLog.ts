import * as server from '@minecraft/server'

export function isCombatLog(player: server.Player): boolean {
    return (player.getDynamicProperty("combatLog") as number) < 600;
}

export function addCombatLog(player: server.Player) {
    player.setDynamicProperty("combatLog", 0)
}