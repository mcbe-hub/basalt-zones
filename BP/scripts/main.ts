import * as server from '@minecraft/server'
import { joinSetup } from './joinSetup.js'
import { getEloString } from './rankingSystem/getEloString.js'
import { checkPlayerLocation } from './portalSystem.js'
import { pvpOff, pvpOn } from './pvpToggle.js'
import 'chat.js'
import 'pressurePlates.js'
import './rankingSystem/rankingDisplays.js'
import 'mine.js'
import 'itemUse.js'
import { isCombatLog } from './combatLog.js'
import { setupParticles } from './particles.js'
import { setupGamerules } from './setupGamerules.js'
import 'combat.js'
import { dailyLogin, getLoginInfo, giveReward } from './dailySystem.js'
import { spawnBat } from './batHunting.js'


const world = server.world
const system = server.system
export const spawnPos = { x: -17, y: 82, z: -40 }



server.system.runTimeout(() => {
    spawnBat()
}, 1500)

world.afterEvents.worldInitialize.subscribe(() => {
    setupParticles()
    setupGamerules()
})


world.afterEvents.playerSpawn.subscribe(data => {
    const player = data.player
    pvpOff(player)
    player.setDynamicProperty("combatLog", 600)
    if (data.initialSpawn) {
        dailyLogin(player)
        joinSetup(player)
        pvpOff(player)
        player.teleport(spawnPos)
    }
})

system.runInterval(() => {
    const players = world.getAllPlayers()
    for (const player of players) {

        player.nameTag = `${getEloString(player.getDynamicProperty("elo") as number)} ${player.name}`
        try {
            const combatLog = player.getDynamicProperty("combatLog") as number
            player.setDynamicProperty("combatLog", combatLog + 1)
            if (!isCombatLog(player)) {
                player.onScreenDisplay.setActionBar(`§aKasa: §2${formatMoney(player.getDynamicProperty("money") as number)}§a$`);
            } else {
                player.onScreenDisplay.setActionBar(`§4Combat Log: §c§l${((600 - combatLog) / 20).toFixed(1)}§r§cs`)
            }
            if (player.dimension.getBlock(player.location)?.typeId === "minecraft:water") {
                checkPlayerLocation(player)
            }
            player.setDynamicProperty("dayPlaytime", player.getDynamicProperty("dayPlaytime") as number + 1)
            player.setDynamicProperty("playtime", player.getDynamicProperty("playtime") as number + 1)
        } catch { }

    }
    if (server.system.currentTick % 50 == 0) {
        for (const player of players) {
            const loginInfo = getLoginInfo(player)
            if (!loginInfo.dailyClaimed && loginInfo.dayPlaytime > 72000) {

                giveReward(player)
            }
        }
    }
})

export function addMoney(player: server.Player, amount: number) {
    const currentMoneyAmount = player.getDynamicProperty("money") as number
    player.setDynamicProperty("money", currentMoneyAmount + amount)
    const currentTotalMoney = player.getDynamicProperty("totalMoney") as number
    player.setDynamicProperty("totalMoney", currentTotalMoney + amount)
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

export function formatMoney(money: number): string {
    if (money >= 1_000_000_000) {
        return (money / 1_000_000_000).toFixed(2) + "b"; // Billions
    } else if (money >= 1_000_000) {
        return (money / 1_000_000).toFixed(2) + "m"; // Millions
    } else if (money >= 1_000) {
        return (money / 1_000).toFixed(2) + "k"; // Thousands
    } else {
        return money.toString(); // Less than 1,000
    }
}

