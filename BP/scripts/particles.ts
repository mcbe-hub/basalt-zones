import * as server from '@minecraft/server'

const overworld = server.world.getDimension("overworld")

export function setupParticles() {
    for (const particle of particles) {
        server.system.runInterval(() => {
            overworld.spawnParticle(particle.id, particle.position)
        }, particle.timeout)
    }
}

interface IParticle {
    id: string
    position: server.Vector3
    timeout: number
}

const particles: IParticle[] = [
    {
        id: "bz:kopalnia",
        timeout: 10,
        position: { x: 15.5, y: 90, z: -40 }
    },
    {
        id: "bz:sklep",
        timeout: 10,
        position: { x: -48.5, y: 90, z: -40 }
    },
    {
        id: "bz:boxpvp",
        timeout: 10,
        position: { x: -16.5, y: 105, z: -7.5 }
    }
]