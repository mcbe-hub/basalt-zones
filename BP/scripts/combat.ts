import * as server from '@minecraft/server'

const world = server.world

world.afterEvents.entityHitEntity.subscribe(data => { })