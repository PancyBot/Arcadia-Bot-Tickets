const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js')

const db = require('../../models/Tickets');
const { PARENTID, EVERYONEID } = require('../../config.json')

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {ButtonInteraction} interaction
     */

    async execute(interaction) {
		
        if(!interaction.isButton()) return;
        const { guild, member, customId } = interaction; 

        if(!['reporte', 'compra', 'otros'].includes(customId)) return;

        const ID = Math.floor(Math.random() * 90000) + 10000;
		console.log(ID)
		if(isNaN(ID)) return interaction.reply({ content: 'Ocurrio un error en la ID', ephemeral: true })

        await guild.channels.create(`${customId + "-" + ID}`, {
            type: 'GUILD_TEXT',
            parent: PARENTID,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                },
                {
                    id: EVERYONEID,
                    deny: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                }
            ]
        }).then(async(channel) => {
            await db.create({
                GuildID: guild.id,
                MemberID: member.id,
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId,
            });

        const Embed = new MessageEmbed()
        .setAuthor(`${guild.name} | Ticket ${ID}`, guild.iconURL({ dynamic: true }))
        .setDescription('Por favor espera la pronta respuesta del staff por lo mientras proporciona una descripcion de tu problema')
        .setFooter(`Ticket ${ID} || ${customId}`)
        .setTimestamp()
        .setColor('GREEN')

        const Buttons = new MessageActionRow()
        Buttons.addComponents(
            new MessageButton()
            .setCustomId('close')
            .setLabel('Guardar y cerrar el ticket')
            .setStyle('PRIMARY')
            .setEmoji('💾'),
            new MessageButton()
            .setCustomId('lock')
            .setLabel('Bloquear ticket')
            .setStyle('SECONDARY')
            .setEmoji('🔒'),
            new MessageButton()
            .setCustomId('unlock')
            .setLabel('Desbloquear ticket')
            .setStyle('SUCCESS')
            .setEmoji('🔓')
        );

        channel.send({
            embeds: [Embed],
            components: [Buttons],
        });
        await channel.send({
            content: `${member} este es tu ticket ||(@STAFF)||`,
        }).then(msg => {
            setTimeout(() => {
                msg.delete().catch(() => {})
            }, 1 * 5000)
        })



        interaction.reply({
            content: `Tu ticket fue creado en: ${channel}`,
            ephemeral: true,
        })
    });

    }
}