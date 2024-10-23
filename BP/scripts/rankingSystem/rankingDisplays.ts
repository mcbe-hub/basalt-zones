import * as server from '@minecraft/server'
import { spawnPos } from '../main.js'

const system = server.system
const world = server.world
const dimension = world.getDimension("overworld")

system.runInterval(() => {
    const players = world.getAllPlayers()
    const entities = dimension.getEntities({ families: ["display"], location: spawnPos, maxDistance: 50 })
    for (const ranking of rankings) {
        const found = entities.find(e => e.hasTag(ranking.id) == true)
        if (found) {
            found.nameTag = handleRanking(ranking, players)
        }
    }
}, 20)

interface IRanking {
    id: string
    property: string
    displayName: string
    footer: string
}

interface IRank {
    name: string
    id: string
    value: number

}

function handleRanking(ranking: IRanking, players: server.Player[]) {

    const leaderboard = JSON.parse((world.getDynamicProperty(`ranking:${ranking.id}`) ?? "[]") as string) as IRank[];

    for (const player of players) {
        const score = player.getDynamicProperty(ranking.property) as number;
        const playerId = player.id;


        const existingPlayerRank = leaderboard.find(entry => entry.id === playerId);

        if (existingPlayerRank) {

            existingPlayerRank.value = score;
        } else {

            leaderboard.push({
                id: playerId,
                value: score,
                name: player.name
            });
        }
    }


    let str = ranking.displayName + "\n "

    leaderboard.sort((a, b) => b.value - a.value);


    for (let i = 0; i < Math.min(10, leaderboard.length); i++) {
        const player = leaderboard[i];


        let color = "§7";
        if (i === 0) color = "§6";
        else if (i === 1) color = "§i";
        else if (i === 2) color = "§n";


        str += `\n${color}§l${i + 1}.§r ${player.name} - §e${player.value}§r\n`;
    }


    str += " \n§7" + ranking.footer;

    world.setDynamicProperty(`ranking:${ranking.id}`, JSON.stringify(leaderboard));
    return str
}


const rankings: IRanking[] = [
    {
        id: "eloRanking",
        property: "elo",
        displayName: "§g§lELO§r §pRanking",
        footer: "ELO to system rankingowy,\n§7za kille zyskujesz ELO\n§7a za przegrane tracisz."
    },
    {
        id: "killRanking",
        property: "kills",
        displayName: "§c§lKill§r §pRanking",
        footer: "Ranking killi!"
    },
    {
        id: "moneyRanking",
        property: "totalMoney",
        displayName: "§d§lMoney§r §pRanking",
        footer: "Ranking łącznej kwoty zarobionej na historii."
    },
    {
        id: "deathsRanking",
        property: "deaths",
        displayName: "§n§lDeath§r §pRanking",
        footer: "Ranking śmierci na serwerze"
    },

]