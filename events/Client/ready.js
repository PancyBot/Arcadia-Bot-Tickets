const { Client } = require('discord.js')

module.exports = {
    name: 'ready',
    once: true,

    /**
     * 
     * @param {Client} client 
     */

    async execute(client) {
        client.user.setPresence({
            activities: [{ name: `Usuarios: ${client.users.cache.size.toLocaleString()} || v0.9.8 Beta Oficial`, type: 'WATCHING' }],
            status: 'dnd',
        })

        console.log(`El bot ${client.user.tag} esta listo, Usuarios en cache: ${client.users.cache.size}`)
    } 
}