import * as server from '@minecraft/server'

const world = server.world

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
        }
    }
})
