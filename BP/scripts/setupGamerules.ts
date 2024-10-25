import { world } from '@minecraft/server'

const gameRules = world.gameRules

export function setupGamerules() {
    gameRules.commandBlockOutput = false
    gameRules.commandBlocksEnabled = true
    gameRules.doDayLightCycle = true
    gameRules.doEntityDrops = true
    gameRules.doFireTick = false
    gameRules.doImmediateRespawn = true
    gameRules.doInsomnia = false
    gameRules.doLimitedCrafting = false
    gameRules.doMobLoot = true
    gameRules.doMobSpawning = false
    gameRules.doTileDrops = true
    gameRules.doWeatherCycle = false
    gameRules.drowningDamage = true
    gameRules.fallDamage = false
    gameRules.fireDamage = true
    gameRules.freezeDamage = true
    gameRules.functionCommandLimit = 1
    gameRules.keepInventory = true
    gameRules.maxCommandChainLength = 1
    gameRules.mobGriefing = false
    gameRules.naturalRegeneration = true
    gameRules.playersSleepingPercentage = 0
    gameRules.projectilesCanBreakBlocks = false
    gameRules.pvp = true
    gameRules.randomTickSpeed = 1
    gameRules.recipesUnlock = false
    gameRules.respawnBlocksExplode = true
    gameRules.sendCommandFeedback = false
    gameRules.showBorderEffect = false
    gameRules.showCoordinates = false
    gameRules.showDaysPlayed = false
    gameRules.showDeathMessages = false
    gameRules.showRecipeMessages = false
    gameRules.showTags = false
    gameRules.spawnRadius = 1
    gameRules.tntExplodes = false
    gameRules.tntExplosionDropDecay = true
}