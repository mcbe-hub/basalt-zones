import * as server from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { addMoney } from './main.js'

// Minimalny czas gry w tickach (60 minut)
const REQUIRED_PLAYTIME_TICKS = 60 * 1200;

export function dailyLogin(player: server.Player) {
    const now = new Date();
    const loginInfo = getLoginInfo(player);

    // Sprawdzenie, czy dzień jest nowy
    const isNewDay = now.toDateString() !== loginInfo.lastLogin.toDateString();

    if (isNewDay) {
        // Reset czasu gry na dzień i aktualizacja daty logowania
        player.setDynamicProperty("dayPlaytime", 0);
        player.setDynamicProperty("lastLogin", now.getTime());

        // Oblicz potencjalną nagrodę
        const streak = player.getDynamicProperty("loginStreak") as number || 1;
        const reward = calculateReward(streak);

        // Wiadomość do gracza
        player.sendMessage(`§aWitaj z powrotem, §e${player.name}§a! §r\n` +
            `§7Dzisiaj możesz odebrać nagrodę w wysokości: §6${reward} monet§7.\n` +
            `§7Aby odebrać nagrodę, zagraj co najmniej §c1 godzinę§7 (72000 ticków) w grze.\n` +
            `§7Seria logowania: §e${streak} dni§7.`);
    } else {
        // Jeśli to nie nowy dzień, sprawdzamy czas gry
        const dayPlaytime = loginInfo.dayPlaytime;

        if (dayPlaytime >= REQUIRED_PLAYTIME_TICKS) {
            // Przyznanie nagrody po wymaganym czasie gry
            if (!player.getDynamicProperty("dailyClaimed") as boolean) {
                giveReward(player)
            } else {
                player.sendMessage("§aMasz już dzisiejszą nagrodę!");
            }
        } else {
            // Powiadomienie o pozostałym czasie gry (przeliczonym na minuty)
            const remainingTicks = REQUIRED_PLAYTIME_TICKS - dayPlaytime;
            const remainingMinutes = Math.ceil(remainingTicks / 1200);
            player.sendMessage(`§cBrakuje ci jeszcze §e${remainingMinutes} minut§c gry, aby odebrać dzisiejszą nagrodę.`);
        }
    }
}

export function giveReward(player: server.Player) {
    const streak = player.getDynamicProperty("loginStreak") as number || 1;
    const reward = calculateReward(streak);

    // Przyznanie nagrody
    player.setDynamicProperty("loginStreak", streak + 1);
    player.setDynamicProperty("dailyClaimed", true)
    addMoney(player, reward)


    // Wiadomość o nagrodzie
    player.sendMessage(`§aGratulacje, §e${player.nameTag}§a! §r\n` +
        `§7Odebrałeś dzisiejszą nagrodę: §6${reward} monet§7.\n` +
        `§7Seria logowania: §e${streak} dni§7.\n` +
        `§7Spróbuj utrzymać serię, aby zdobywać większe nagrody!`);
}

export function calculateReward(streak: number): number {
    const baseReward = 50000; // Podstawowa nagroda
    const bonusReward = (streak - 1) * 25000; // Bonus za streak
    return baseReward + bonusReward;
}

export function getLoginInfo(player: server.Player) {
    return {
        dayPlaytime: player.getDynamicProperty("dayPlaytime") as number || 0,
        lastLogin: new Date(player.getDynamicProperty("lastLogin") as number || 0),
        dailyClaimed: player.getDynamicProperty("dailyClaimed") as boolean
    };
}

