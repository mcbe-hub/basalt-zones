import * as server from '@minecraft/server'
import { joinSetup } from './joinSetup.js'
import { getEloString } from './rankingSystem/getEloString.js'
import { checkPlayerLocation } from './portalSystem.js'
import 'chat.js'
import 'pressurePlates.js'
import './rankingSystem/rankingDisplays.js'
import 'mine.js'
import { isCombatLog } from './combatLog.js'
import { setupParticles } from './particles.js'

const world = server.world
const system = server.system
export const spawnPos = { x: -17, y: 82, z: -40 }

world.afterEvents.worldInitialize.subscribe(() => {
    setupParticles()
})

world.afterEvents.playerSpawn.subscribe(data => {
    const player = data.player
    if (data.initialSpawn) {
        joinSetup(player)
    }
})

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        player.nameTag = `${getEloString(player.getDynamicProperty("elo") as number)} ${player.name}`
        try {
            if (!isCombatLog(player)) {
                player.onScreenDisplay.setActionBar(`§aKasa: §2${player.getDynamicProperty("money")}§a$`)
            } else {

            }
            if (player.dimension.getBlock(player.location)?.typeId === "minecraft:water") {
                checkPlayerLocation(player)
            }
        } catch { }
    }
})

export function addMoney(player: server.Player, amount: number) {
    const currentMoneyAmount = player.getDynamicProperty("money") as number
    player.setDynamicProperty("money", currentMoneyAmount + amount)
    const currentTotalMoney = player.getDynamicProperty("totalMoney") as number
    player.setDynamicProperty("totalMoney", currentMoneyAmount + amount)
}

export function payMoney(player: server.Player, amount: number) {
    player.setDynamicProperty("money", player.getDynamicProperty("money") as number + amount)
}