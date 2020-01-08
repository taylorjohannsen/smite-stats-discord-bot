const Discord = require('discord.js');
const token = require('./utility/token')
const botCommands = require('./utility/commands')
const bot = new Discord.Client();
bot.commands = new Discord.Collection()

Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key])
})

bot.login(token)

bot.on('ready', () => {
    console.log('bot is ready!!')
    console.log(bot.user.tag)
})

bot.on('message', (message) => {
    const args = message.content.split(/ +/)
    const command = args[0]

    if (!bot.commands.has(command)) return

    bot.commands.get(command).execute(message, args)
}) 