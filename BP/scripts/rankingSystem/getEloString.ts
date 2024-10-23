export function getEloString(elo: number) {
    if (elo >= 2500) {
        return `§g[§p${elo}§g]§r`
    }
    if (elo >= 2000) {
        return `§u[§d${elo}§u]§r`
    }
    if (elo >= 1800) {
        return `§5[§u${elo}§5]§r`
    }
    if (elo >= 1600) {
        return `§t[§b${elo}§t]§r`
    }
    if (elo >= 1400) {
        return `§3[§s${elo}§3]§r`
    }
    if (elo >= 1200) {
        return `§7[§8${elo}§7]§r`
    }
    if (elo >= 1000) {
        return `§f[§i${elo}§f]§r`
    }
    if (elo < 1000) {
        return `§h[§j${elo}§h]§r`
    }
}