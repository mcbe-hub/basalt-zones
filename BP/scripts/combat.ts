import * as server from '@minecraft/server'
import { addCombatLog, isCombatLog } from './combatLog.js'
import { postKillElo } from './rankingSystem/postKillElo.js'
import { getEloString } from './rankingSystem/getEloString.js'
import { addMoney, payMoney } from './main.js'
import { setKit } from './kitSystem.js'

const world = server.world

world.afterEvents.entityHitEntity.subscribe(data => {
    const hitEntity = data.hitEntity
    const hitter = data.damagingEntity
    if (hitEntity instanceof server.Player && hitter instanceof server.Player) {
        if (hitEntity.getDynamicProperty("pvp") && hitter.getDynamicProperty("pvp")) {
            addCombatLog(hitEntity)
            addCombatLog(hitter)
            hitEntity.setDynamicProperty("opponent", hitter.id)
            hitter.setDynamicProperty("opponent", hitEntity.id)
        }
    }
})

world.afterEvents.entityDie.subscribe(data => {
    const dead = data.deadEntity
    if (dead instanceof server.Player) {
        const killer = world.getEntity(dead.getDynamicProperty("opponent") as string) as server.Player
        if (killer instanceof server.Player) {
            postKillElo(killer, dead)
            playerEloMessage(killer, dead)
            splitMoney(killer, dead)
            setKit(killer, killer.getDynamicProperty("kit") as string, false)
        }
    } else if (dead.typeId == "minecraft:bat") {
        const player = data.damageSource.damagingEntity
        const randomMoney = Math.floor(Math.random() * 50000) + 15000
        if (player instanceof server.Player) {
            world.sendMessage(`${player.nameTag} zabija nietoperza! Zyskuje: §a${randomMoney}§r$ kasy!`)
        }
    }
})

world.beforeEvents.playerLeave.subscribe(data => {
    const player = data.player
    if (isCombatLog(player)) {
        try {
            const opponent = world.getEntity(player.getDynamicProperty("opponent") as string)
            if (opponent instanceof server.Player) {
                postKillElo(opponent, player)
                playerEloMessage(opponent, player)
                splitMoney(opponent, player)
                opponent.setDynamicProperty("opponent")
                player.setDynamicProperty("opponent")
                server.system.run(() => {
                    setKit(opponent, opponent.getDynamicProperty("kit") as string, false)
                })
            }
        } catch {

        }
    }
})

function playerEloMessage(winner: server.Player, loser: server.Player) {
    world.sendMessage(`§s${winner.name}§r zabija §n${loser.name}§r!\nNowe Elo: §s${winner.name}§r: ${getEloString(winner.getDynamicProperty("elo") as number)}, §n${loser.name}§r: ${getEloString(loser.getDynamicProperty("elo") as number)}`);
}



function splitMoney(winner: server.Player, loser: server.Player) {
    const moneyPortion = Math.floor((loser.getDynamicProperty("money") as number) * 0.3)
    payMoney(loser, moneyPortion)
    addMoney(winner, moneyPortion)
    const msg = `§s${winner.name}§r zyskuje §a${moneyPortion}§r$ z kasy §n${loser.name}§r!`
    winner.sendMessage(msg)
    try {
        loser.sendMessage(msg)
    } catch {

    }
}