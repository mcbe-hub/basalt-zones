import * as server from '@minecraft/server'
import { ActionFormData, ModalFormResponse } from '@minecraft/server-ui'
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

                        break;
                    case 2:
                        miningShop(player)
                        break
                }
            }
        })
}

function enchantShop(player: server.Player) {

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
                        if (hasEnoughMoney(player, hasteLevel)) {
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