import * as server from '@minecraft/server';
import { setKit } from './kitSystem.js';
import { mainShopUi } from './shop.js'

const dimension = server.world.getDimension("overworld");

function teleportToArena(player: server.Player, arena: IArena) {
    const level = player.getDynamicProperty("level") as number

    player.teleport({ x: (arena.start.x + arena.end.x) / 2, y: 320, z: (arena.end.y + arena.start.y) / 2 })
    server.system.runTimeout(() => {
        setKit(player, arena.kitId);
        const x = Math.floor(Math.random() * (arena.end.x - arena.start.x - 6)) + arena.start.x + 3;
        const z = Math.floor(Math.random() * (arena.end.y - arena.start.y - 6)) + arena.start.y + 3;
        player.teleport(dimension.getTopmostBlock({ x: x, z: z }).above().center());
    }, 10)

}

interface IArena {
    start: server.Vector2;
    end: server.Vector2;
    id: string;
    kitId: string;
}


const chainMailArena: IArena = {
    start: { x: 2085, y: 2008 },
    end: { x: 2045, y: 2095 },
    id: "chainArena",
    kitId: "chainmailKit",
}
const ironArena: IArena = {
    start: { x: 3097, y: 3014 },
    end: { x: 3034, y: 3085 },
    id: "ironArena",
    kitId: "ironKit",
}


interface IRegion {
    blockVolume: server.BlockVolume;
    id: string;
    onEnter?: (player: server.Player) => void;
}

const regions: IRegion[] = [
    {
        blockVolume: new server.BlockVolume({ x: 5, y: 80, z: -16 }, { x: 7, y: 90, z: -18 }),
        id: "chainArena",
        onEnter: handleChainArena
    },
    {
        blockVolume: new server.BlockVolume({ x: -41, y: 86, z: -18 }, { x: -39, y: 80, z: -16 }),
        id: "ironArena",
        onEnter: handleIronArena
    },
    {
        blockVolume: new server.BlockVolume({ x: -49, y: 80, z: -41 }, { x: -49, y: 90, z: -39 }),
        id: "shopArea",
        onEnter: handleShopArea
    },
    {
        blockVolume: new server.BlockVolume({ x: 15, y: 80, z: -41 }, { x: 12, y: 90, z: -39 }),
        id: "mineArea",
        onEnter: handleMineArea
    }
];

function handleChainArena(player: server.Player) {
    teleportToArena(player, chainMailArena)
}

function handleIronArena(player: server.Player) {
    teleportToArena(player, ironArena)
}

function handleShopArea(player: server.Player) {
    mainShopUi(player)
    player.teleport({ x: -46.5, y: 81, z: -40 })
}

function handleMineArea(player: server.Player) {
    player.teleport({ x: 5000, y: 302, z: 5020 })
}

function teleportPlayerToRegion(player: server.Player, region: IRegion) {
    // Optional: Add logic to teleport players or perform actions specific to the region
    server.system.run(() => {
        if (region.onEnter) {
            region.onEnter(player); // Call the region's onEnter function
        }
    });
}

export function checkPlayerLocation(player: server.Player) {
    for (const region of regions) {
        if (region.blockVolume.isInside(player.location)) {
            teleportPlayerToRegion(player, region);
            break;
        }
    }
}