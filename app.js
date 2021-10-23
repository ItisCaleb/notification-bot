const Discord = require('discord.js');
const client = new Discord.Client();
const conf = require("./config")();
const commandsHandler = require("./commands")
const cronjob = require("./cronjobs")
let config = conf.getConfig()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    cronjob(client)
});


client.on('message', msg => {
    commandsHandler(msg)
});

client.login(config.token).then(()=>{
    console.log('Login')
});
