import * as server from '@minecraft/server';

// Function to set the player's kit
export function setKit(player: server.Player, id: string) {
    const kit = kitsMap.get(id); // Now using .get() to retrieve from Map

    if (kit) {
        const inv = player.getComponent("inventory").container;
        inv.clearAll();
        const equipment = player.getComponent("equippable");

        equipment.setEquipment(server.EquipmentSlot.Head, kit.helmet);
        equipment.setEquipment(server.EquipmentSlot.Chest, kit.chestplate);
        equipment.setEquipment(server.EquipmentSlot.Legs, kit.leggings);
        equipment.setEquipment(server.EquipmentSlot.Feet, kit.boots);
        equipment.setEquipment(server.EquipmentSlot.Offhand, undefined);

        inv.addItem(kit.weapon);
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
}

// Define the kits
const leatherKit: IKit = {
    helmet: new server.ItemStack("minecraft:leather_helmet", 1),
    chestplate: new server.ItemStack("minecraft:leather_chestplate", 1),
    leggings: new server.ItemStack("minecraft:leather_leggings", 1),
    boots: new server.ItemStack("minecraft:leather_boots", 1),
    weapon: new server.ItemStack("minecraft:stone_sword", 1),
    items: []  // No items
};

const chainmailKit: IKit = {
    helmet: new server.ItemStack("minecraft:chainmail_helmet", 1),
    chestplate: new server.ItemStack("minecraft:chainmail_chestplate", 1),
    leggings: new server.ItemStack("minecraft:chainmail_leggings", 1),
    boots: new server.ItemStack("minecraft:chainmail_boots", 1),
    weapon: new server.ItemStack("minecraft:iron_sword", 1),
    items: []  // No items
};

const ironKit: IKit = {
    helmet: new server.ItemStack("minecraft:iron_helmet", 1),
    chestplate: new server.ItemStack("minecraft:iron_chestplate", 1),
    leggings: new server.ItemStack("minecraft:iron_leggings", 1),
    boots: new server.ItemStack("minecraft:iron_boots", 1),
    weapon: new server.ItemStack("minecraft:diamond_sword", 1),
    items: []  // No items
};

const diamondKit: IKit = {
    helmet: new server.ItemStack("minecraft:diamond_helmet", 1),
    chestplate: new server.ItemStack("minecraft:diamond_chestplate", 1),
    leggings: new server.ItemStack("minecraft:diamond_leggings", 1),
    boots: new server.ItemStack("minecraft:diamond_boots", 1),
    weapon: new server.ItemStack("minecraft:diamond_sword", 1),
    items: []  // No items
};

const netheriteKit: IKit = {
    helmet: new server.ItemStack("minecraft:netherite_helmet", 1),
    chestplate: new server.ItemStack("minecraft:netherite_chestplate", 1),
    leggings: new server.ItemStack("minecraft:netherite_leggings", 1),
    boots: new server.ItemStack("minecraft:netherite_boots", 1),
    weapon: new server.ItemStack("minecraft:netherite_sword", 1),
    items: []  // No items
};

// Empty Kit: All air (no equipment or items)
const emptyKit: IKit = {
    helmet: new server.ItemStack("minecraft:air", 1),
    chestplate: new server.ItemStack("minecraft:air", 1),
    leggings: new server.ItemStack("minecraft:air", 1),
    boots: new server.ItemStack("minecraft:air", 1),
    weapon: new server.ItemStack("minecraft:air", 1),
    items: []  // No items
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
