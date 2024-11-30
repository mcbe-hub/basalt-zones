import * as server from '@minecraft/server'

const { world } = server;

world.afterEvents.itemUse.subscribe(data => {
    if (data.source instanceof server.Player) {
        const player = data.source
        const item = data.itemStack
        const cooldown = item.getComponent("cooldown")
        switch (item.typeId) {
            case "bz:leap":
                if (cooldown.getCooldownTicksRemaining(player) == 0) {
                    const view = player.getViewDirection()
                    player.applyKnockback(view.x, view.z, 4.5, 0.5)
                    cooldown.startCooldown(player)
                }
                break;
            case "bz:blink":
                if (cooldown.getCooldownTicksRemaining(player) == 0) {

                    const nearestPlayer = player.dimension.getEntities({ location: player.location, minDistance: 2, maxDistance: 8 })[0]
                    if (nearestPlayer instanceof server.Player) {

                        const playerRot = nearestPlayer.getRotation();
                        const playerPos = nearestPlayer.location;
                        // Convert rotation angles to radians
                        const yawRad = (playerRot.y * (Math.PI / 180));
                        const pitchRad = playerRot.x * (Math.PI / 180);

                        // Calculate offset based on player's direction
                        const offsetX = -Math.sin(yawRad) * Math.cos(pitchRad) * -2;

                        const offsetZ = Math.cos(yawRad) * Math.cos(pitchRad) * -2;

                        // Calculate block position
                        const blockX = (playerPos.x + offsetX);
                        const blockZ = (playerPos.z + offsetZ);
                        const tp = player.tryTeleport({ x: blockX, y: playerPos.y + 0.3, z: blockZ }, { facingLocation: { x: playerPos.x, y: playerPos.y, z: playerPos.z }, checkForBlocks: true })
                        if (tp) {
                            cooldown.startCooldown(player)
                        }
                    }
                }
                break;
            case "bz:shooter":
                const inventory = player.getComponent("inventory").container
                if (handleArrow(inventory)) {

                    for (let i = 0; i < 200; i++) {
                        try {
                            player.dimension.spawnParticle("minecraft:blue_flame_particle", getBlockInFrontOfPlayer(player, i / 6, 1))
                        } catch { }
                    }
                    player.getEntitiesFromViewDirection({ maxDistance: 200 / 6 }).forEach(rayCastHit => {
                        const entity = rayCastHit.entity
                        if (entity instanceof server.Player) {
                            if (entity.getDynamicProperty("pvp")) {
                                entity.applyDamage(0.00005, { damagingEntity: player, cause: server.EntityDamageCause.entityAttack })
                                entity.applyDamage(4, { damagingEntity: player, cause: server.EntityDamageCause.void })
                                player.setDynamicProperty("combatLog", 0)
                                entity.setDynamicProperty("combatLog", 0)
                                player.setDynamicProperty("opponent", entity.id)
                                entity.setDynamicProperty("opponent", player.id)
                            }
                        }
                    })

                }
                break;
        }
    }
})

function handleArrow(container: server.Container) {
    for (let i = 0; i < 36; i++) {
        const item = container.getItem(i)
        if (item instanceof server.ItemStack) {
            if (item.typeId == "minecraft:arrow") {
                if (item.amount > 1) {
                    container.setItem(i, new server.ItemStack("minecraft:arrow", item.amount - 1))
                } else {
                    container.setItem(i)
                }
                return true
            }
        }
    }
    return false
}

function getBlockInFrontOfPlayer(player: server.Player, distance: number, yOffset?: number) {
    let playerPos = player.location
    if (yOffset != undefined) playerPos.y += yOffset
    const playerRot = player.getRotation();

    // Convert rotation angles to radians
    const yawRad = (playerRot.y * (Math.PI / 180));
    const pitchRad = playerRot.x * (Math.PI / 180);

    // Calculate offset based on player's direction
    const offsetX = -Math.sin(yawRad) * Math.cos(pitchRad) * distance;
    const offsetY = -Math.sin(pitchRad) * distance;
    const offsetZ = Math.cos(yawRad) * Math.cos(pitchRad) * distance;

    // Calculate block position
    const blockX = (playerPos.x + offsetX);
    const blockY = (playerPos.y + offsetY);
    const blockZ = (playerPos.z + offsetZ);

    // Return the block at the calculated position
    return { x: blockX, y: blockY, z: blockZ }
}
