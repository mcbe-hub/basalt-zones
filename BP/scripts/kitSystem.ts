import * as server from '@minecraft/server';
import { fullClear } from './main.js'


// Function to set the player's kit
export function setKit(player: server.Player, id: string, clearOffHand = true) {
    const kit = kitsMap.get(id); // Now using .get() to retrieve from Map

    if (kit) {
        const inv = player.getComponent("inventory").container;
        fullClear(player);
        const equipment = player.getComponent("equippable");

        // Retrieve enchantment levels from player properties
        const unbreakingLevel = player.getDynamicProperty("unbreaking") as number || 0;
        const protectionLevel = player.getDynamicProperty("protection") as number || 0;
        const mendingLevel = player.getDynamicProperty("mending") as number || 0;
        const sharpnessLevel = player.getDynamicProperty("sharpness") as number || 0;
        const powerLevel = player.getDynamicProperty("power") as number || 0;
        const fireAspectLevel = player.getDynamicProperty("fireAspect") as number || 0;

        // Helmet setup with Unbreaking and Protection
        const helmet = kit.helmet.clone();
        const helmetEnchants = helmet.getComponent("enchantable");
        helmetEnchants.addEnchantment({ level: unbreakingLevel, type: server.EnchantmentTypes.get("unbreaking") });
        helmetEnchants.addEnchantment({ level: protectionLevel, type: server.EnchantmentTypes.get("protection") });
        equipment.setEquipment(server.EquipmentSlot.Head, helmet);

        // Chestplate setup with Unbreaking and Protection
        const chestplate = kit.chestplate.clone();
        const chestplateEnchants = chestplate.getComponent("enchantable");
        chestplateEnchants.addEnchantment({ level: unbreakingLevel, type: server.EnchantmentTypes.get("unbreaking") });
        chestplateEnchants.addEnchantment({ level: protectionLevel, type: server.EnchantmentTypes.get("protection") });
        equipment.setEquipment(server.EquipmentSlot.Chest, chestplate);

        // Leggings setup with Unbreaking and Protection
        const leggings = kit.leggings.clone();
        const leggingsEnchants = leggings.getComponent("enchantable");
        leggingsEnchants.addEnchantment({ level: unbreakingLevel, type: server.EnchantmentTypes.get("unbreaking") });
        leggingsEnchants.addEnchantment({ level: protectionLevel, type: server.EnchantmentTypes.get("protection") });
        equipment.setEquipment(server.EquipmentSlot.Legs, leggings);

        // Boots setup with Unbreaking and Protection
        const boots = kit.boots.clone();
        const bootsEnchants = boots.getComponent("enchantable");
        bootsEnchants.addEnchantment({ level: unbreakingLevel, type: server.EnchantmentTypes.get("unbreaking") });
        bootsEnchants.addEnchantment({ level: protectionLevel, type: server.EnchantmentTypes.get("protection") });
        equipment.setEquipment(server.EquipmentSlot.Feet, boots);

        if (clearOffHand) {
            equipment.setEquipment(server.EquipmentSlot.Offhand);
        }

        // Weapon setup with Sharpness, Unbreaking, and Fire Aspect
        const weapon = kit.weapon.clone();
        const weaponEnchants = weapon.getComponent("enchantable");
        weaponEnchants.addEnchantment({ level: sharpnessLevel, type: server.EnchantmentTypes.get("sharpness") });
        weaponEnchants.addEnchantment({ level: unbreakingLevel, type: server.EnchantmentTypes.get("unbreaking") });
        if (fireAspectLevel > 0) {
            weaponEnchants.addEnchantment({ level: fireAspectLevel, type: server.EnchantmentTypes.get("fire_aspect") });
        }
        inv.addItem(weapon);

        // Bow setup with Power, Unbreaking, and Mending (if applicable)

        const bow = new server.ItemStack("minecraft:bow")
        const bowEnchants = bow.getComponent("enchantable");
        bowEnchants.addEnchantment({ level: powerLevel, type: server.EnchantmentTypes.get("power") });
        bowEnchants.addEnchantment({ level: unbreakingLevel, type: server.EnchantmentTypes.get("unbreaking") });
        if (mendingLevel > 0) {
            bowEnchants.addEnchantment({ level: mendingLevel, type: server.EnchantmentTypes.get("mending") });
        }
        inv.addItem(bow);

        let arrowAmount = kit.arrowAmount
        let slot = 19
        while (arrowAmount > 64) {
            inv.setItem(slot, new server.ItemStack("minecraft:arrow", 64))
            arrowAmount = arrowAmount - 64
            slot--
        }
        inv.setItem(slot, new server.ItemStack("minecraft:arrow", arrowAmount))


        for (const item of ["leap", "blink", "shooter"]) {
            if (player.getDynamicProperty(item)) {
                inv.addItem(new server.ItemStack("bz:" + item))
            }
        }

        kit.items.forEach(item => {
            inv.addItem(item);
        });

    }
}



// Interface for the kits
interface IKit {
    helmet: server.ItemStack;
    chestplate: server.ItemStack;
    leggings: server.ItemStack;
    boots: server.ItemStack;
    weapon: server.ItemStack;
    items: server.ItemStack[];  // Items array
    arrowAmount: number
}

// Define the kits
const leatherKit: IKit = {
    helmet: new server.ItemStack("minecraft:leather_helmet", 1),
    chestplate: new server.ItemStack("minecraft:leather_chestplate", 1),
    leggings: new server.ItemStack("minecraft:leather_leggings", 1),
    boots: new server.ItemStack("minecraft:leather_boots", 1),
    weapon: new server.ItemStack("minecraft:stone_sword", 1),
    items: [],
    arrowAmount: 16
};

const chainmailKit: IKit = {
    helmet: new server.ItemStack("minecraft:chainmail_helmet", 1),
    chestplate: new server.ItemStack("minecraft:chainmail_chestplate", 1),
    leggings: new server.ItemStack("minecraft:chainmail_leggings", 1),
    boots: new server.ItemStack("minecraft:chainmail_boots", 1),
    weapon: new server.ItemStack("minecraft:iron_sword", 1),
    items: [new server.ItemStack("minecraft:fishing_rod", 1), new server.ItemStack("minecraft:wind_charge", 8), new server.ItemStack("minecraft:golden_apple", 2), new server.ItemStack("minecraft:cooked_beef", 32)],
    arrowAmount: 32
};

const mace = new server.ItemStack("minecraft:mace")
mace.getComponent("enchantable").addEnchantment({ level: 2, type: server.EnchantmentTypes.get("breach") })

const ironKit: IKit = {
    helmet: new server.ItemStack("minecraft:iron_helmet", 1),
    chestplate: new server.ItemStack("minecraft:iron_chestplate", 1),
    leggings: new server.ItemStack("minecraft:iron_leggings", 1),
    boots: new server.ItemStack("minecraft:iron_boots", 1),
    weapon: new server.ItemStack("minecraft:diamond_sword", 1),
    items: [mace, new server.ItemStack("minecraft:wind_charge", 16), new server.ItemStack("minecraft:golden_apple", 8), new server.ItemStack("minecraft:enchanted_golden_apple", 2), new server.ItemStack("minecraft:cooked_beef", 32)],
    arrowAmount: 64
};

const diamondKit: IKit = {
    helmet: new server.ItemStack("minecraft:diamond_helmet", 1),
    chestplate: new server.ItemStack("minecraft:diamond_chestplate", 1),
    leggings: new server.ItemStack("minecraft:diamond_leggings", 1),
    boots: new server.ItemStack("minecraft:diamond_boots", 1),
    weapon: new server.ItemStack("minecraft:diamond_sword", 1),
    items: [],
    arrowAmount: 64
};

const efficiency = { level: 3, type: server.EnchantmentTypes.get("minecraft:efficiency") } as server.Enchantment
const pickaxe = new server.ItemStack("minecraft:netherite_pickaxe")
pickaxe.getComponent("enchantable").addEnchantment(efficiency)
const axe = new server.ItemStack("minecraft:netherite_axe")
axe.getComponent("enchantable").addEnchantment(efficiency)


const netheriteKit: IKit = {
    helmet: new server.ItemStack("minecraft:netherite_helmet", 1),
    chestplate: new server.ItemStack("minecraft:netherite_chestplate", 1),
    leggings: new server.ItemStack("minecraft:netherite_leggings", 1),
    boots: new server.ItemStack("minecraft:netherite_boots", 1),
    weapon: new server.ItemStack("minecraft:netherite_sword", 1),
    items: [new server.ItemStack("minecraft:cobblestone", 64), new server.ItemStack("minecraft:oak_log", 64),
    new server.ItemStack("minecraft:golden_apple", 16),
    new server.ItemStack("minecraft:enchanted_golden_apple", 4),
    new server.ItemStack("minecraft:obsidian", 16),
    new server.ItemStack("minecraft:end_crystal", 32),
        pickaxe,
        axe,
    new server.ItemStack("minecraft:lava_bucket"),
    new server.ItemStack("minecraft:water_bucket"),
    new server.ItemStack("minecraft:cooked_beef", 32)],
    arrowAmount: 128
};

// Empty Kit: All air (no equipment or items)
const emptyKit: IKit = {
    helmet: new server.ItemStack("minecraft:air", 1),
    chestplate: new server.ItemStack("minecraft:air", 1),
    leggings: new server.ItemStack("minecraft:air", 1),
    boots: new server.ItemStack("minecraft:air", 1),
    weapon: new server.ItemStack("minecraft:air", 1),
    items: [],
    arrowAmount: 0
};

// Map to store kits
const kitsMap: Map<string, IKit> = new Map<string, IKit>([
    ["leatherKit", leatherKit],
    ["chainmailKit", chainmailKit],
    ["ironKit", ironKit],
    ["diamondKit", diamondKit],
    ["netheriteKit", netheriteKit],
    ["emptyKit", emptyKit]  // Add the empty kit here
]);
