import * as server from '@minecraft/server'
import { joinSetup } from './joinSetup.js'
import { getEloString } from './rankingSystem/getEloString.js'
import { checkPlayerLocation } from './portalSystem.js'
import { pvpOff, pvpOn } from './pvpToggle.js'
import 'chat.js'
import 'pressurePlates.js'
import './rankingSystem/rankingDisplays.js'
import 'mine.js'
import { isCombatLog } from './combatLog.js'
import { setupParticles } from './particles.js'
import { setupGamerules } from './setupGamerules.js'
import 'combat.js'

const world = server.world
const system = server.system
export const spawnPos = { x: -17, y: 82, z: -40 }

world.afterEvents.worldInitialize.subscribe(() => {
    setupParticles()
    setupGamerules()
})

world.afterEvents.playerSpawn.subscribe(data => {
    const player = data.player
    if (data.initialSpawn) {
        joinSetup(player)
        pvpOff(player)
    }
})

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {


        player.nameTag = `${getEloString(player.getDynamicProperty("elo") as number)} ${player.name}`
        try {
            const combatLog = player.getDynamicProperty("combatLog") as number
            player.setDynamicProperty("combatLog", combatLog + 1)
            if (!isCombatLog(player)) {
                player.onScreenDisplay.setActionBar(`§aKasa: §2${player.getDynamicProperty("money")}§a$`)
            } else {
                player.onScreenDisplay.setActionBar(`${((600 - combatLog) / 20).toFixed(1)}`)
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
    player.setDynamicProperty("money", player.getDynamicProperty("money") as number - amount)
}

export function addToDynamicProperty(player: server.Player, property: string, amount: number) {
    player.setDynamicProperty(property, player.getDynamicProperty(property) as number + amount)
}

export function clearEffects(player: server.Player) {
    server.EffectTypes.getAll().forEach(e => {
        player.removeEffect(e)
    })
}

export function spawnTeleport(player: server.Player) {
    if (!isCombatLog(player)) {
        pvpOff(player)
        player.teleport(spawnPos)
        clearEffects(player)
    } else {
        player.sendMessage("§cNie możesz się teleportować podczas walki!")
    }
}

export function fullClear(player: server.Player) {
    player.getComponent("inventory").container.clearAll()
    const equippable = player.getComponent("equippable")
    equippable.setEquipment(server.EquipmentSlot.Body)
    equippable.setEquipment(server.EquipmentSlot.Chest)
    equippable.setEquipment(server.EquipmentSlot.Feet)
    equippable.setEquipment(server.EquipmentSlot.Head)
    equippable.setEquipment(server.EquipmentSlot.Legs)
    equippable.setEquipment(server.EquipmentSlot.Mainhand)
    equippable.setEquipment(server.EquipmentSlot.Offhand)
}