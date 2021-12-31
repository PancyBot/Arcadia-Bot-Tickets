const Discord = require('discord.js')
const { CommandInteraction, MessageEmbed, MessageButton, MessageActionRow, Client} = require('discord.js')
const { OPENTICKETID } = require('../../config.json')
module.exports = {
    name: 'ticket',
    description: 'Crea un ticket', 
    
    /**
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    run: async(client, interaction) => {
        const { guild } = interaction

        const Embed = new MessageEmbed()
        .setAuthor(guild.name + "| Sistema de Tickets", guild.iconURL({ dynamic: true }))
        .setDescription("Abre un ticket para una duda, compra o reporte de bug")
        .setColor('#36393f')

        const Buttons = new MessageActionRow()
        Buttons.addComponents(
            new MessageButton()
            .setCustomId('reporte')
            .setLabel('Bug report')
            .setStyle('PRIMARY')
            .setEmoji('🎟️'),
            new MessageButton()
            .setCustomId('compra')
            .setLabel('Compra de rango VIP')
            .setStyle('SECONDARY')
            .setEmoji('👾'),
            new MessageButton()
            .setCustomId('otros')
            .setLabel('Otros')
            .setStyle('SUCCESS')
            .setEmoji('🎫')
        );

        await guild.channels.cache.get(OPENTICKETID)
        .send({ embeds: [Embed], components: [Buttons] })

        interaction.followUp({ content: 'Listo', ephemeral: true })
    }
}