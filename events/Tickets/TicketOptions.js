const { ButtonInteraction, MessageEmbed } = require('discord.js');
const { createTranscript } = require('discord-html-transcripts');
const { TRANSCRIPID } = require('../../config.json');
const db = require('../../models/Tickets')

module.exports = {
    name: 'interactionCreate',

    /**
     * @param {ButtonInteraction} interaction 
     */
    
    async execute(interaction) {
        if(!interaction.isButton()) return;

        const { guild, customId, channel, member } = interaction



        if(!['close', 'lock', 'unlock'].includes(customId)) return;

        const Embed = new MessageEmbed().setColor('BLUE')

        db.findOne({ ChannelID: channel.id }, async(err, docs) => {
            if(err) throw err;
            if(!docs) return interaction.reply({
                content: 'No se encontro la informacion del ticket, por favor borrar el ticket manualmente',
                ephemeral: true,
            })

            switch(customId){
                case 'lock':
                    if(docs.Locked === true) return interaction.reply({
                        content: 'El ticket ya estaba bloqueado',
                        ephemeral: true,
                    })
                    await db.updateOne({ ChannelID: channel.id}, { Locked: true})
                    Embed.setDescription('🔒 | El ticket fue bloqueado')
                    channel.permissionOverwrites.edit(docs.MemberID, {
                        SEND_MESSAGES: false,
                        VIEW_CHANNEL: false
                    })
                    interaction.reply({ embeds: [Embed]})
                    break;
                case 'unlock':
                    if(docs.Locked === false) return interaction.reply({
                        content: 'El ticket ya estaba desbloqueado',
                        ephemeral: true,
                    })
                    await db.updateOne({ ChannelID: channel.id}, { Locked: false})
                    Embed.setDescription('🔒 | El ticket fue desbloqueado')
                    channel.permissionOverwrites.edit(docs.MemberID, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    })
                    interaction.reply({ embeds: [Embed]})
                    break;
                case 'close': 
                    if(docs.Closed === true) return interaction.reply({
                        content: 'El ticket ya esta cerrado espera que se borre',
                        ephemeral: true,
                    })
                    const attachment = await createTranscript(channel, {
                        limit: -1,
                        returnBuffer: false,
                        fileName: `${docs.Type} - ${docs.TicketID}.html`,
                    })
                    await db.updateOne({ ChannelID: channel.id }, { Closed: true })

                    const MEMBER = guild.members.cache.get(docs.MemberID)
                    const Message = await guild.channels.cache.get(TRANSCRIPID).send({
                        embeds: [
                            Embed.setAuthor({ 
                                name: MEMBER.user.tag, 
                                url: MEMBER.user.displayAvatarURL({dynamic: true})
                            }).setTitle(`Tipo de transcripcion: ${docs.Type}\n ID: ${docs.TicketID}`)
                        ],
                        files: [attachment]
                    })

                    interaction.reply({
                        embeds: [Embed.setDescription(`Se salvo la transcripcion, [TRANSCRIPT](${Message.url})`)],
                    })

                    setTimeout(() => {
                        channel.delete()
                    }, 15000)
            }
        })
    }
}