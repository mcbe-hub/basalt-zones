import * as server from '@minecraft/server'

server.world.afterEvents.pressurePlatePush.subscribe(data => {
    const source = data.source
    if (source.typeId == "minecraft:player") {
        const block = data.block
        const dimension = data.dimension
        const view = source.getViewDirection()
        dimension.playSound("component.jump_to_block", block.location)
        dimension.spawnParticle("minecraft:camera_shoot_explosion", block.above().location)
        switch (block.typeId) {
            case "minecraft:light_weighted_pressure_plate":
                source.applyKnockback(view.x, view.z, 4.5, 0.6)
                break;
            case "minecraft:heavy_weighted_pressure_plate":
                source.applyKnockback(view.x, view.z, 2, 1.2)
                break;
        }
    }
})