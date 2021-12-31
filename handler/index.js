const { glob } = require("glob");
const { promisify } = require("util");
const { Client } = require("discord.js");
const { Events } = require('../Validation/EventsNames')
const mongoose = require("mongoose");
const Ascii = require('ascii-table')

const globPromise = promisify(glob);

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });





    // Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/SlashCommands/*/*.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
	
    client.on("ready", async () => {
        // Register for a single guild
        await client.guilds.cache
            .get("873371564664574053")
            .commands.set(arrayOfSlashCommands);
			console.log(arrayOfSlashCommands)

        // Register for all the guilds the bot is in
        // await client.application.commands.set(arrayOfSlashCommands);
    });



	mongoose.connect(`${process.env.URLDB}`,{
    useUnifiedTopology : true,
    useNewUrlParser : true,
	}).then(console.log('conectado a la base de datos externa')).catch(e => {
    console.log(`Error al conectar a la base de datos ${e}`)
	})

}