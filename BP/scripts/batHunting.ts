import * as server from '@minecraft/server'
import { ironArena, chainMailArena, netheriteArena, IArena } from './portalSystem.js'

const world = server.world
const batTimer = 1000
const dimension = world.getDimension("overworld")

export function spawnBat() {
    const arenas = [
        { arena: ironArena, name: "Miejskiej Arenie" },
        { arena: chainMailArena, name: "Budowlanej Arenie" },
        { arena: netheriteArena, name: "BOXPVP" }
    ];

    const selectedArena = arenas[Math.floor(Math.random() * arenas.length)];
    const arena = selectedArena.arena;
    const arenaName = selectedArena.name;

    let spawnLoc = { x: 0, y: 0, z: 0 };
    try {
        const x = Math.floor(Math.random() * (arena.end.x - arena.start.x - 6)) + arena.start.x + 3;
        const z = Math.floor(Math.random() * (arena.end.y - arena.start.y - 6)) + arena.start.y + 3;
        spawnLoc = dimension.getTopmostBlock({ x: x, z: z })?.above()?.center() as server.Vector3;
    } catch {
        return;
    }

    const bat = dimension.spawnEntity("minecraft:bat", spawnLoc);
    world.sendMessage(`§a✨ Nietoperz pojawił się na §e${arenaName}§a! Zabij go, zanim ucieknie aby uzyskać nagrodę!`);

    for (let i = batTimer; i > 0; i--) {
        server.system.runTimeout(() => {
            if (bat.isValid()) {
                const remainingSeconds = Math.ceil(i / 20);
                bat.nameTag = `§e⏳ Pozostały czas: §c${remainingSeconds}s`;
            }
        }, batTimer - i);
    };


    server.system.runTimeout(() => {
        if (bat.isValid()) {
            bat.kill();
            world.sendMessage("§c⚠ §lNietoperz uciekł w mrok nocy, a nagroda przepadła! §r\n§7Spróbuj ponownie następnym razem!");
        }
    }, batTimer);
};