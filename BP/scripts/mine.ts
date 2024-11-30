import * as server from '@minecraft/server'
import { addMoney } from './main.js'

const world = server.world
const system = server.system
const dimension = world.getDimension("overworld")

const oreValues: { [key: string]: number } = {
    "minecraft:stone": 1,
    "minecraft:coal_ore": 10,
    "minecraft:iron_ore": 25,
    "minecraft:gold_ore": 50,
    "minecraft:diamond_ore": 200,
    "minecraft:emerald_ore": 500,
    "minecraft:lapis_ore": 15,
    "minecraft:redstone_ore": 8,
    "minecraft:quartz_ore": 7,
    "minecraft:nether_gold_ore": 15,
    "minecraft:ancient_debris": 75,
    "minecraft:copper_ore": 10,
};

function getOreValue(oreId: string): number {
    return oreValues[oreId] || 0;
}

const oreToolRequirements: { [key: string]: number } = {
    "minecraft:coal_ore": 1,
    "minecraft:iron_ore": 2,
    "minecraft:gold_ore": 2,
    "minecraft:diamond_ore": 3,
    "minecraft:emerald_ore": 4,
    "minecraft:lapis_ore": 2,
    "minecraft:redstone_ore": 2,
    "minecraft:copper_ore": 1,
};

const pickaxeMiningPower: { [key: string]: number } = {
    "minecraft:wooden_pickaxe": 1,   // Can break stone and ores with a level of 1 or lower
    "minecraft:stone_pickaxe": 2,     // Can break ores with a level of 2 or lower
    "minecraft:iron_pickaxe": 3,      // Can break ores with a level of 3 or lower
    "minecraft:diamond_pickaxe": 4,   // Can break ores with a level of 4 or lower
    "minecraft:netherite_pickaxe": 4, // Can break ores with a level of 4 or lower
};

// Example usage
function getPickaxeMiningPower(pickaxeId: string): number {
    return pickaxeMiningPower[pickaxeId] || -1; // Returns -1 if the pickaxe is not found
}


// Example usage
function getOreToolRequirement(oreId: string): number {
    return oreToolRequirements[oreId] || -1; // Returns -1 if the ore is not found
}


const minBounds = { x: 4984, y: -63, z: 4984 };
const maxBounds = { x: 5016, y: 319, z: 5016 };

world.beforeEvents.playerBreakBlock.subscribe(data => {
    const block = data.block;
    const player = data.player;


    const { x, y, z } = block.location;


    if (
        x >= minBounds.x && x <= maxBounds.x &&
        y >= minBounds.y && y <= maxBounds.y &&
        z >= minBounds.z && z <= maxBounds.z
    ) {
        try {
            if (getPickaxeMiningPower(data.itemStack?.typeId ?? "") < getOreToolRequirement(block.typeId)) {
                data.cancel = true;
                player.sendMessage("§c§lPotrzebujesz lepszego kilofa!§r\n§7Lepszy kilof możesz nabyć w sklepie!")
                return;
            };

            addMoney(player, getOreValue(block.typeId) * Math.floor(Math.random() * Math.pow((20 + Math.round(Math.max(1, 50 - y) / 2)), 1.1)))
        } catch {};
    }
});

system.runInterval(() => {
    fillMine()
}, 5000)

async function fillMine() {
    const volume = new server.BlockVolume(
        { x: 5015, y: -61, z: 5015 },
        { x: 4985, y: 300, z: 4985 }
    );

    const ores = [
        { id: "minecraft:stone", weight: 60 },
        { id: "minecraft:coal_ore", weight: 20 },
        { id: "minecraft:iron_ore", weight: 10 },
        { id: "minecraft:gold_ore", weight: 5 },
        { id: "minecraft:diamond_ore", weight: 2 },
        { id: "minecraft:emerald_ore", weight: 1 }
    ];

    // Function to get a random ore based on Y-level
    function getRandomOre(y: number) {
        // Adjust weights based on depth (lower Y-level = better ores)
        const adjustedOres = ores.map(ore => {
            let weightMultiplier = 1;
            if (y < 0) {
                weightMultiplier = 1 + (Math.abs(y) / 100); // More rare ores the lower you go (Y < 0)
            } else if (y > 50) {
                weightMultiplier = 0.5; // Make ores more sparse higher up (Y > 50)
            }
            return { id: ore.id, weight: ore.weight * weightMultiplier };
        });

        const totalWeight = adjustedOres.reduce((sum, ore) => sum + ore.weight, 0);
        let random = Math.random() * totalWeight;

        for (const ore of adjustedOres) {
            if (random < ore.weight) {
                return ore.id;
            }
            random -= ore.weight;
        }
        return "minecraft:stone";  // Fallback to stone
    }

    // Iterator for block locations in the volume
    const blockIterator = volume.getBlockLocationIterator();
    let blockCount = 0;
    const blocksPerTick = 1000; // Number of blocks to fill per tick (adjust as needed for performance)

    for (const block of blockIterator) {
        const ore = getRandomOre(block.y); // Pass the Y-level to adjust ore chances
        dimension.setBlockType(block, ore); // No need to pass dimension, directly access it
        blockCount++;

        // After processing a set number of blocks, wait for the next tick
        if (blockCount % blocksPerTick === 0) {
            await system.waitTicks(1);  // Wait for 1 tick after every chunk of blocks
        }
    }
    for (let i = 301; i < 320; i++) {
        const volume = new server.BlockVolume(
            { x: 5015, y: i, z: 5015 },
            { x: 4985, y: i, z: 4985 }
        );
        dimension.fillBlocks(volume, "minecraft:air")
    }
}