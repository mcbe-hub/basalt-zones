import { Player } from '@minecraft/server'

const defaultValues: ({
    identifier: string,
    value: string | number | boolean
})[] = [
        {
            identifier: "elo",
            value: 1000
        },
        {
            identifier: "money",
            value: 0
        },
        {
            identifier: "totalMoney",
            value: 0
        },
        {
            identifier: "kills",
            value: 0
        },
        {
            identifier: "deaths",
            value: 0
        },
        {
            identifier: "combatLog",
            value: 600
        },
        {
            identifier: "haste",
            value: 0
        },
        {
            identifier: "pickaxe",
            value: 0
        },
        {
            identifier: "efficiency",
            value: 0
        },
        {
            identifier: "sharpness",
            value: 0
        },
        {
            identifier: "protection",
            value: 0
        },
        {
            identifier: "unbreaking",
            value: 0
        },
        {
            identifier: "power",
            value: 0
        },
        {
            identifier: "fireAspect",
            value: 0
        },
        {
            identifier: "blink",
            value: false
        },
        {
            identifier: "shooter",
            value: false
        },
        {
            identifier: "leap",
            value: false
        },
        {
            identifier: "playtime",
            value: 0
        },
        {
            identifier: "dailyClaimed",
            value: false
        }
    ];

export function joinSetup(player: Player) {
    for (const { identifier, value } of defaultValues) {
        if (player.getDynamicProperty(identifier) !== undefined) continue;
        player.setDynamicProperty(identifier, value);
    };

    player.setDynamicProperty("pvp", false);
};