import * as server from '@minecraft/server';
import { setKit } from './kitSystem.js';
import { mainShopUi } from './shop.js'
import { fullClear, spawnPos } from './main.js'
import { pvpOff, pvpOn } from './pvpToggle.js'

const dimension = server.world.getDimension("overworld");

function teleportToArena(player: server.Player, arena: IArena) {
    const totalMoney = player.getDynamicProperty("totalMoney") as number
    if (totalMoney >= arena.totalMoney) {

        player.teleport({ x: (arena.start.x + arena.end.x) / 2, y: 320, z: (arena.end.y + arena.start.y) / 2 })
        server.system.runTimeout(() => {
            setKit(player, arena.kitId);
            player.setDynamicProperty("kit", arena.kitId)
            const x = Math.floor(Math.random() * (arena.end.x - arena.start.x - 6)) + arena.start.x + 3;
            const z = Math.floor(Math.random() * (arena.end.y - arena.start.y - 6)) + arena.start.y + 3;
            player.teleport(dimension.getTopmostBlock({ x: x, z: z }).above().center());
        }, 10)
    } else {
        const x = player.location.x
        const z = player.location.z
        const spawnDirection = directionToSpawn({ x: x, z: z }, spawnPos)
        player.applyKnockback(spawnDirection.x, spawnDirection.z, 3, 0.3)
        if (server.system.currentTick % 2 == 0) {
            player.sendMessage("§cNie możesz tutaj jeszcze wejść!\n" + `§rMusisz łącznie zarobić §a${arena.totalMoney}§r kasy aby móc tutaj wejść!\nKasę możesz zarobić kopiąc w kopalni!`)
        }
    }

}

export interface IArena {
    start: server.Vector2;
    end: server.Vector2;
    id: string;
    kitId: string;
    totalMoney: number
}


export const chainMailArena: IArena = {
    start: { x: 2085, y: 2008 },
    end: { x: 2045, y: 2095 },
    id: "chainArena",
    kitId: "chainmailKit",
    totalMoney: 500
}
export const ironArena: IArena = {
    start: { x: 3097, y: 3014 },
    end: { x: 3034, y: 3085 },
    id: "ironArena",
    kitId: "ironKit",
    totalMoney: 100000
}
export const netheriteArena: IArena = {
    start: { x: 3925, y: 3925 },
    end: { x: 4075, y: 4075 },
    id: "netheriteArena",
    kitId: "netheriteKit",
    totalMoney: 1000000
}


interface IRegion {
    blockVolume: server.BlockVolume;
    id: string;
    onEnter?: (player: server.Player) => void;
    enablePvp: boolean
}

const regions: IRegion[] = [
    {
        blockVolume: new server.BlockVolume({ x: 5, y: 80, z: -16 }, { x: 7, y: 90, z: -18 }),
        id: "chainArena",
        onEnter: handleChainArena,
        enablePvp: true
    },
    {
        blockVolume: new server.BlockVolume({ x: -41, y: 86, z: -18 }, { x: -39, y: 80, z: -16 }),
        id: "ironArena",
        onEnter: handleIronArena,
        enablePvp: true
    },
    {
        blockVolume: new server.BlockVolume({ x: -49, y: 80, z: -41 }, { x: -49, y: 90, z: -39 }),
        id: "shopArea",
        onEnter: handleShopArea,
        enablePvp: false
    },
    {
        blockVolume: new server.BlockVolume({ x: 15, y: 80, z: -41 }, { x: 12, y: 90, z: -39 }),
        id: "mineArea",
        onEnter: handleMineArea,
        enablePvp: false
    },
    {
        blockVolume: new server.BlockVolume({ x: -13, y: 80, z: -9 }, { x: -19, y: 92, z: -6 }),
        id: "netheriteArena",
        onEnter: handleNetheriteArena,
        enablePvp: true
    }
];

function handleChainArena(player: server.Player) {
    teleportToArena(player, chainMailArena)
}

function handleIronArena(player: server.Player) {
    teleportToArena(player, ironArena)
}

function handleNetheriteArena(player: server.Player) {
    teleportToArena(player, netheriteArena)
}

function handleShopArea(player: server.Player) {
    mainShopUi(player)
    player.teleport({ x: -46.5, y: 81, z: -40 })
}

function handleMineArea(player: server.Player) {
    const container = player.getComponent("inventory").container
    const pickaxeLevel = player.getDynamicProperty("pickaxe") as number
    const efficiencyLevel = player.getDynamicProperty("efficiency") as number
    const hasteLevel = player.getDynamicProperty("haste") as number
    fullClear(player)
    const itemStack = new server.ItemStack(["minecraft:wooden_pickaxe", "minecraft:stone_pickaxe", "minecraft:iron_pickaxe", "minecraft:diamond_pickaxe", "minecraft:netherite_pickaxe"][pickaxeLevel])
    itemStack.getComponent("enchantable").addEnchantment({ level: efficiencyLevel, type: server.EnchantmentTypes.get("efficiency") })
    container.addItem(itemStack)
    if (hasteLevel > 0) {
        player.addEffect("haste", 9999999, { showParticles: false, amplifier: hasteLevel - 1 })
    }
    player.addEffect("saturation", 9999999, { showParticles: false, amplifier: 200 })
    player.teleport({ x: 5000, y: 302, z: 5020 })
}

function teleportPlayerToRegion(player: server.Player, region: IRegion) {
    // Optional: Add logic to teleport players or perform actions specific to the region
    server.system.run(() => {
        if (region.onEnter) {
            if (region.enablePvp) {
                pvpOn(player)
            } else {
                pvpOff(player)
            }
            region.onEnter(player); // Call the region's onEnter function
        }
    });
}

export function checkPlayerLocation(player: server.Player) {
    for (const region of regions) {
        if (region.blockVolume.isInside(player.location)) {
            teleportPlayerToRegion(player, region);
            player.addEffect("saturation", 5, { amplifier: 200, showParticles: false })
            player.addEffect("instant_health", 5, { amplifier: 200, showParticles: false })
            break;
        }
    }
}

const directionToSpawn = (
    { x, z }: { x: number; z: number },
    spawnPos: { x: number; y: number; z: number }
): { x: number; z: number } => {
    // Calculate the difference between the current position and spawn position
    const dx = spawnPos.x - x;
    const dz = spawnPos.z - z;

    // Calculate the distance to normalize
    const distance = Math.sqrt(dx * dx + dz * dz);

    // Normalize the direction
    const normalizedX = dx / distance;
    const normalizedZ = dz / distance;

    return { x: normalizedX, z: normalizedZ };
};

export { directionToSpawn };
