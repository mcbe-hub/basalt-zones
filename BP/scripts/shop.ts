import * as server from '@minecraft/server'
import { ActionFormData, ModalFormResponse, MessageFormData } from '@minecraft/server-ui'
import { addMoney, payMoney, addToDynamicProperty } from './main.js'

function hasEnoughMoney(player: server.Player, amount: number) {
    const money = player.getDynamicProperty("money") as number
    if (money >= amount) return true
    player.sendMessage("§cNie masz tyle kasy!")
    return false
}

export function mainShopUi(player: server.Player) {
    new ActionFormData()
        .title("Sklep")
        .body("\nWitaj w sklepie serwerowym! Wybierz kategorię jaka cię interesuje:\n ")
        .button("Enchanty", "textures/items/book_enchanted.png")
        .button("Dodatkowe Itemy", "textures/items/feather.png")
        .button("Kopanie", "textures/items/diamond_pickaxe.png")
        .show(player).then(data => {
            if (!data.canceled) {
                switch (data.selection) {
                    case 0:
                        enchantShop(player)
                        break;
                    case 1:
                        specialItemShop(player)
                        break;
                    case 2:
                        miningShop(player)
                        break
                }
            }
        })
}

interface ISpecialItem {
    name: string
    price: number
    icon: string
    description: string
    requirementAmount: number
    requirementProperty: string
    property: string
}
const specialItems: ISpecialItem[] = [
    {
        name: "§eLeap",
        price: 500000,
        icon: "textures/items/feather.png",
        description: "§7Pozwala na szybki skok do przodu na dystans.\n§7Cena: §e500,000 monet.\n§7Odblokuj za: §e1250 elo.",
        requirementProperty: "elo",
        requirementAmount: 1250,
        property: "leap"
    },
    {
        name: "§dBlink",
        price: 1000000,
        icon: "textures/items/ender_eye.png",
        description: "§7Teleportuje cię za przeciwnika.\n§7Czas odnowienia: §e15 sekund.\n§7Cena: §e1,000,000 monet.\n§7Odblokuj za łącznie zarobione: §e5,000,000 monet.",
        requirementProperty: "totalMoney",
        requirementAmount: 5000000,
        property: "blink"
    },
    {
        name: "§cShooter",
        price: 2500000,
        icon: "textures/items/crossbow_pulling_0.png",
        description: "§7Strzela laserem zadającym §e2 serca §7obrażeń ignorujących zbroję.\n§7Cena: §e2,500,000 monet.\n§7Odblokuj za: §e50 zabójstw.",
        requirementProperty: "kills",
        requirementAmount: 50,
        property: "shooter"
    },
];



function specialItemShop(player: server.Player) {
    const ui = new ActionFormData()
        .title("Specjalne Itemy")
    for (const item of specialItems) {
        ui.button(`§d§l${item.name}§r`, item.icon)
    }
    ui.show(player).then(data => {
        if (!data.canceled) {
            const selection = specialItems[data.selection]
            if (selection) {
                console.warn(player.getDynamicProperty(selection.property))
                if (!player.getDynamicProperty(selection.property)) {
                    new MessageFormData().title(selection.name)
                        .body(selection.description)
                        .button2("Kup")
                        .button1("Anuluj")
                        .show(player).then(data => {
                            if (!data.canceled) {
                                if (data.selection == 1) {

                                    if (player.getDynamicProperty(selection.requirementProperty) >= selection.requirementAmount) {
                                        if (hasEnoughMoney(player, selection.price)) {
                                            player.setDynamicProperty(selection.property, true)
                                            payMoney(player, selection.price)
                                            player.sendMessage("§aPomyślnie zakupiono:§r §d§l" + selection.name)
                                        }
                                    } else { player.sendMessage("§cNie spełniasz wymagań aby to kupić!") }
                                } else {
                                    player.sendMessage("§cAnulowano!")
                                }
                            }
                        })
                } else {
                    player.sendMessage("§cMasz już ten przedmiot!")
                }
            } else { player.sendMessage("§l§cERROR!") }
        }
    })
}

function enchantShop(player: server.Player) {

    const sharpnessLevel = player.getDynamicProperty("sharpness") as number || 0;
    const protectionLevel = player.getDynamicProperty("protection") as number || 0;
    const mendingLevel = player.getDynamicProperty("mending") as number || 0;
    const unbreakingLevel = player.getDynamicProperty("unbreaking") as number || 0;
    const powerLevel = player.getDynamicProperty("power") as number || 0;
    const fireAspectLevel = player.getDynamicProperty("fireAspect") as number || 0;


    const enchantCosts = {
        sharpness: [25000, 50000, 100000, 250000, 1000000],
        protection: [50000, 100000, 250000, 1000000],
        mending: [2500000],
        unbreaking: [200000, 1000000, 5000000],
        power: [25000, 50000, 100000, 250000, 1000000],
        fireAspect: [150000, 500000]
    };

    const ui = new ActionFormData()
        .title("Sklep Enchantów")
        .body("\nWybierz enchant, który chcesz ulepszyć!\n")

    if (sharpnessLevel < 5) {
        ui.button(`Sharpness ${romanize(sharpnessLevel + 1)} - §2${enchantCosts.sharpness[sharpnessLevel]}`, "textures/items/diamond_sword.png");
    } else {
        ui.button("§l§2Nie ma już wyższego Sharpness!");
    }

    if (protectionLevel < 4) {
        ui.button(`Protection ${romanize(protectionLevel + 1)} - §2${enchantCosts.protection[protectionLevel]}`, "textures/items/diamond_chestplate.png");
    } else {
        ui.button("§l§2Nie ma już wyższego Protection!");
    }

    if (mendingLevel < 1) {
        ui.button(`Mending - §2${enchantCosts.mending[0]}`, "textures/items/book_enchanted.png");
    } else {
        ui.button("Masz już Mending!");
    }

    if (unbreakingLevel < 3) {
        ui.button(`Unbreaking ${romanize(unbreakingLevel + 1)} - §2${enchantCosts.unbreaking[unbreakingLevel]}`, "textures/items/book_enchanted.png");
    } else {
        ui.button("§l§2Nie ma już wyższego Unbreaking!");
    }

    if (powerLevel < 5) {
        ui.button(`Power ${romanize(powerLevel + 1)} - §2${enchantCosts.power[powerLevel]}`, "textures/items/bow_pulling_1.png");
    } else {
        ui.button("§l§2Nie ma już wyższego Power!");
    }

    if (fireAspectLevel < 2) {
        ui.button(`Fire Aspect ${romanize(fireAspectLevel + 1)} - §2${enchantCosts.fireAspect[fireAspectLevel]}`, "textures/items/diamond_sword.png");
    } else {
        ui.button("§l§2Masz już maksymalny poziom Fire Aspect!");
    }

    // Show the UI and handle selections
    ui.show(player).then(data => {
        if (!data.canceled) {
            const selection = data.selection;
            let cost = 0;
            let enchantProperty = "";
            let currentLevel = 0;

            switch (selection) {
                case 0: // Sharpness
                    cost = enchantCosts.sharpness[sharpnessLevel];
                    enchantProperty = "sharpness";
                    currentLevel = sharpnessLevel;
                    break;
                case 1: // Protection
                    cost = enchantCosts.protection[protectionLevel];
                    enchantProperty = "protection";
                    currentLevel = protectionLevel;
                    break;
                case 2: // Mending
                    cost = enchantCosts.mending[mendingLevel];
                    enchantProperty = "mending";
                    currentLevel = mendingLevel;
                    break;
                case 3: // Unbreaking
                    cost = enchantCosts.unbreaking[unbreakingLevel];
                    enchantProperty = "unbreaking";
                    currentLevel = unbreakingLevel;
                    break;
                case 4: // Power
                    cost = enchantCosts.power[powerLevel];
                    enchantProperty = "power";
                    currentLevel = powerLevel;
                    break;
                case 5: // Fire Aspect
                    cost = enchantCosts.fireAspect[fireAspectLevel];
                    enchantProperty = "fireAspect";
                    currentLevel = fireAspectLevel;
                    break;
            }

            // Check if player has enough money and process the upgrade
            if (hasEnoughMoney(player, cost)) {
                payMoney(player, cost);
                addToDynamicProperty(player, enchantProperty, 1);
                player.sendMessage(`§aUlepszono ${enchantProperty} na poziom ${romanize(currentLevel + 1)}!`);
                player.playSound("random.orb");
            }

        }
    });
}



function miningShop(player: server.Player) {
    const pickaxeLevel = player.getDynamicProperty("pickaxe") as number
    const efficiencyLevel = player.getDynamicProperty("efficiency") as number
    const hasteLevel = player.getDynamicProperty("haste") as number
    const hasteCost = (hasteLevel + 1) * 1000000
    const ui = new ActionFormData()
        .title("Sklep Kopalnia")
        .body("\nTutaj możesz kupić różne ulepszenia do kopania!\nHaste zwiększa poziom efektu jaki masz w kopalni.\nEfficiency zmienia poziom enchantu efficiency na twoim kilofie.\nKupiony kilof zmienia to do jakiego kilofu masz dostęp w kopalni.\n ")
    if (pickaxeLevel < 4) {
        const pickaxe = pickArray[pickaxeLevel]
        ui.button(pickaxe.text + " - §2" + pickaxe.cost, pickaxe.icon)
    } else {
        ui.button("§l§2Nie ma już lepszych kilofów!")
    }
    if (efficiencyLevel < 5) {
        ui.button("Efficiency " + romanize(efficiencyLevel + 1) + " - §2" + efficiencyCosts[efficiencyLevel], "textures/items/enchanted_book.png")
    } else {
        ui.button("§l§2Nie ma już wyższego efficiency!")
    }
    if (hasteLevel < 100) {
        ui.button("Haste " + romanize(hasteLevel + 1) + " - §2" + hasteCost, "textures/ui/haste_effect.png")
    } else {
        ui.button("Masz maksymalny poziom haste!")
    }
    ui.show(player).then(data => {
        if (!data.canceled) {
            switch (data.selection) {
                case 0:
                    if (pickaxeLevel < 4) {
                        const pickaxe = pickArray[pickaxeLevel]
                        if (hasEnoughMoney(player, pickaxe.cost)) {
                            payMoney(player, pickaxe.cost)
                            addToDynamicProperty(player, "pickaxe", 1)
                            player.sendMessage("§aZakupiony lepszy kilof!")
                            player.playSound("random.orb")
                        }
                    } else {
                        player.sendMessage("§4Nie możesz już tego ulepszać!")
                    }
                    break;
                case 1:
                    if (efficiencyLevel < 5) {
                        const cost = efficiencyCosts[efficiencyLevel]
                        if (hasEnoughMoney(player, cost)) {
                            payMoney(player, cost)
                            addToDynamicProperty(player, "efficiency", 1)
                            player.sendMessage("§aUlepszono poziom efficiency!")
                            player.playSound("random.orb")
                        }
                    } else {
                        player.sendMessage("§4Nie możesz już tego ulepszać!")
                    }
                    break;
                case 2:
                    if (hasteLevel < 100) {
                        if (hasEnoughMoney(player, hasteCost)) {
                            payMoney(player, hasteCost)
                            addToDynamicProperty(player, "haste", 1)
                            player.sendMessage("§aUlepszono poziom haste!")
                            player.playSound("random.orb")
                        }
                    }
                    break;
            }
        }
    })
}

const efficiencyCosts: number[] = [
    250000,
    1000000,
    5000000,
    10000000,
    50000000
]

const pickArray: IPickaxe[] = [
    {
        cost: 25000,
        text: "Kamienny Kilof",
        icon: "textures/items/stone_pickaxe.png"
    },
    {
        cost: 100000,
        text: "Żelazny Kilof",
        icon: "textures/items/iron_pickaxe.png"
    },
    {
        cost: 500000,
        text: "Diamentowy Kilof",
        icon: "textures/items/diamond_pickaxe.png"
    },
    {
        cost: 2000000,
        text: "Netherytowy Kilof",
        icon: "textures/items/netherite_pickaxe.png"
    }
]

interface IPickaxe {
    cost: number
    text: string
    icon: string
}

export const romanize = (input: number | string): string => {

    const num = Number(input);

    if (isNaN(num)) {
        throw new Error(`"${input}" is not a number that can be converted to Roman numerals.`);
    }

    if (!Number.isInteger(num)) {
        throw new Error(`Only integers can be converted to Roman numerals.`);
    }

    if (num < 0) {
        throw new Error(`Only positive numbers can be converted to Roman numerals.`);
    }

    const digits = num.toString().split('');
    const numerals = [
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', // set 0 (   1 -   9 )
        '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC', // set 1 (  10 -  90 )
        '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM', // set 2 ( 100 - 900 )
    ];

    let roman = '';
    [0, 1, 2].forEach((numeralSet) => {
        const currentDigit = Number(digits.pop());

        if (isNaN(currentDigit)) {
            return;
        }

        const numeralsIndex = currentDigit + (numeralSet * 10);
        const numeral = numerals[numeralsIndex];
        roman = numeral + roman;
    });

    const thousands = Number(digits.join(''));
    const thousandsNumerals = 'M'.repeat(thousands);
    return thousandsNumerals + roman;
};