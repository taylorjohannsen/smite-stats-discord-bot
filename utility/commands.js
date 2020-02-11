const axios = require('axios')
const { RichEmbed } = require('discord.js')

module.exports = {
    Player: {
        name: '!player',
        description: 'Gets player profile data',
        async execute(msg, args) {
            let playerData = await axios.get('https://api.smite.taylorjohannsen.com/discord/player/justvincent').then(res => { return res.data })

            const embed = new RichEmbed()

            embed.setTitle(playerData.name)
            let objArray = Object.entries(playerData)

            for await (let pair of objArray) {
                embed.message({
                    name: pair[0],
                    value: pair[1]
                })
            }

            // work on getting this working


            msg.channel.send(embed);
        }
    }
}