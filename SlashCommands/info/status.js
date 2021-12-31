const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const { connection } = require('mongoose');
require('../../events/Client/ready');

module.exports = {
    name: 'status',
    description: 'Muestra el estado de la base de datos y del bot',

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */

    async execute(interaction, client) {

        const Respuesta = new MessageEmbed()
        .setColor('AQUA')
        .setDescription(`**Bot**: \`🟢 EN LINEA\` - \`${client.ws.ping}\`\n**Uptime**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n
        **Base de datos**: \`${switchTo(connection.readyState)}\``)

        interaction.followUp({ embeds: [Respuesta] })
    }

}

function swithTo(val) {
    var status = " ";
    switch(val) {
        case 0 : status = "🔴 DESCONECTADA"
        break;
        case 1 : status = "🟢 CONECTADA"
        break;
        case 2 : status = "🟠 CONECTANDO"
        break;
        case 3 : status = "🟣 DESCONECTANDO"
        break;
    }
    return status;
}