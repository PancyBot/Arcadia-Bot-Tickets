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

    // Events
    const table = new Ascii("Eventos Cargados")

    (await globPromise(`${process.cwd}/events/*/*.js`)).map(async file => {
        const events = require(file);

        if(!Events.includes(events.name) || !events.name) {
            const L = file.split('/')
            await table.addRow(`${events.name} || "No encontrado"`, `⛔ El nombre del evento es invalido o no se encontro: ${L[6] + `/` + L[7]}`)
            return;
        };

        if(events.once) {
            client.once(events.name, (...args) => events.execute(...args, client))
        } else {
            client.on(events.name, (...args) => events.execute(...args, client))
        }

        await table.addRow(events.name, "Cargado")
    })

    console.log(table.toString())



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
            .get("replace this with your guild id")
            .commands.set(arrayOfSlashCommands);

        // Register for all the guilds the bot is in
        // await client.application.commands.set(arrayOfSlashCommands);
    });



    mongoose.connect(mongooseConnectionString).then(() => console.log('Connected to mongodb'));
};