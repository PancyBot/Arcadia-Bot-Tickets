const { Client } = require('discord.js')
const Database = process.env.URLDB
const mongoose = require('mongoose')

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
        if(!Database) return; 
        mongoose.connect(Database,{
            useUnifiedTopology : true,
            useNewUrlParser : true,
            }).then(console.log('conectado a la base de datos externa')).catch(e => {
            console.log(`Error al conectar a la base de datos ${e}`)
            })
    } 
}