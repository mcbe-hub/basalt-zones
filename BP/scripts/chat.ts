import * as server from '@minecraft/server'
import { isAdmin, modMenu } from './adminStuff.js'
import { getEloString } from './rankingSystem/getEloString.js'
import { ActionFormData, ActionFormResponse, ModalFormData, ModalFormResponse } from '@minecraft/server-ui'
import { isCombatLog } from './combatLog.js'
import { spawnPos } from './main.js'

const world = server.world
const system = server.system

world.beforeEvents.chatSend.subscribe(data => {
    data.cancel = true
    const msg = data.message
    const player = data.sender
    if (msg[0] == "!") {
        const split = msg.split(" ")
        switch (split[0]) {
            case "!mod":
                system.run(() => {
                    if (permCheck(player)) modMenu(player);
                })
                break;
            case "!spawn":
                if (!isCombatLog(player)) {
                    system.run(() => {
                        player.teleport(spawnPos)
                    })
                }
                break;

            default: player.sendMessage("§cNie ma takiej komendy!")
        }
    } else {
        const muteDate = player.getDynamicProperty("muteDate") as number
        const lastMsg = player.getDynamicProperty("lastMsg") as number
        const now = new Date().getTime()


        if (muteDate == undefined || muteDate < new Date().getTime()) {
            if ((lastMsg == undefined || now - (lastMsg + 5000) > 0) || isAdmin(player)) {
                world.sendMessage(`${getEloString(player.getDynamicProperty("elo") as number)} ${player.name}§7: ${msg}`)
                player.setDynamicProperty("lastMsg", now)
            } else {
                player.sendMessage(`§cMożesz wysyłać wiadomości jedynie co 5 sekund!`)
            }
        } else {
            player.sendMessage(`§cMasz mute'a!\nPozostały czas: §m${timeLeftUntilDate(new Date(muteDate))}\n§4Powód: §r§o${player.getDynamicProperty("muteReason")}`)
        }
    }
})

function permCheck(player: server.Player) {
    if (isAdmin(player)) {
        return true
    }
    player.sendMessage("§cNie masz pozwolenia by używać tej komendy!")
}

function timeLeftUntilDate(targetDate) {
    const currentDate = new Date();
    const difference = targetDate.getTime() - currentDate.getTime();

    if (difference <= 0) {
        return "The target date has already passed.";
    }

    const millisecondsInSecond = 1000;
    const millisecondsInMinute = millisecondsInSecond * 60;
    const millisecondsInHour = millisecondsInMinute * 60;
    const millisecondsInDay = millisecondsInHour * 24;

    const days = Math.floor(difference / millisecondsInDay);
    const hours = Math.floor((difference % millisecondsInDay) / millisecondsInHour);
    const minutes = Math.floor((difference % millisecondsInHour) / millisecondsInMinute);
    const seconds = Math.floor((difference % millisecondsInMinute) / millisecondsInSecond);

    let result = "";
    if (days > 0) {
        result += days + " dni" + (days !== 1 ? "s" : "") + ", ";
    }
    if (hours > 0) {
        result += hours + " godzin" + (hours !== 1 ? "s" : "") + ", ";
    }
    if (minutes > 0) {
        result += minutes + " minut" + (minutes !== 1 ? "s" : "") + ", ";
    }
    if (seconds > 0) {
        result += seconds + " sekund" + (seconds !== 1 ? "s" : "");
    }

    return result;
}

export async function forceShow(form: ModalFormData | ActionFormData, player: server.Player): Promise<ActionFormResponse | ModalFormResponse | null> {
    const res = await form.show(player)
    if (res.cancelationReason !== "UserBusy" || !player.isValid()) return res as ActionFormResponse | ModalFormResponse
    return await forceShow(form, player)
}
