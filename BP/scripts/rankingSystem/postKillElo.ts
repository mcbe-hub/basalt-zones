import { Player, world } from '@minecraft/server'
import { getEloString } from './getEloString.js'

export function postKillElo(winner: Player, loser: Player) {
    const winnerElo = winner.getDynamicProperty("elo") as number ?? 1000;
    const loserElo = loser.getDynamicProperty("elo") as number ?? 1000;

    const K = 32; // K-factor

    // Expected scores
    const winnerExpected = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
    const loserExpected = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));

    // Update Elo ratings
    const winnerNewElo = Math.round(winnerElo + K * (1 - winnerExpected)); // Winner gets 1 point for winning
    const loserNewElo = Math.round(loserElo + K * (0 - loserExpected));    // Loser gets 0 points for losing

    // Set new Elo ratings
    winner.setDynamicProperty("elo", winnerNewElo);
    loser.setDynamicProperty("elo", loserNewElo);

}
