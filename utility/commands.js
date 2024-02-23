const axios = require('axios')
const { EmbedBuilder } = require('discord.js')

module.exports = {
    Player: {
        name: '!player',
        description: 'Gets player profile data',
        async execute(msg, args) {
            try {
                let playerData = await axios.get('https://api.smite.taylorjohannsen.com/discord/player/' + args[1]).then(res => { return res.data }).catch(err => console.log(err))

                const embed = new EmbedBuilder()

                embed.setTitle(playerData.name + ' - ' + `[${playerData.team}]`) 
                embed.setColor(3447003)
                embed.setThumbnail(playerData.icon)
                embed.setAuthor({name : 'Click here for more stats!', url: 'https://smite.taylorjohannsen.com/player/' + args[1]})

                let objArray = Object.entries(playerData)
                objArray.splice(0, 2)

                for await (let pair of objArray) {
                    let dataObj = {
                        name: pair[0],
                        value: pair[1].toString(),
                        inline: false
                    }

                    embed.addFields({ name: dataObj.name, value: dataObj.value, inline: dataObj.inline})
                }

                msg.channel.send({ embeds: [embed]});
            }

            catch(err) {
                console.log(err)
                msg.channel.send('Error: Player does not exist!');
            }
        }
    },
    Match: {
        name: '!matches',
        description: 'Gets last 5 matches for a player',
        async execute(msg, args) {
            try {
                let playerData = await axios.get('https://api.smite.taylorjohannsen.com/discord/matches/' + args[1]).then(res => { return res.data }).catch(err => { throw err.message })
                const smallArray = playerData.matches.slice(0, 5)  
                const embed = new RichEmbed()

                embed.setTitle('Last 5 Matches - ' + args[1]) 
                embed.setColor('#ff0000')

                for await (let match of smallArray) {
                    const checkWin = match.win ? 'Win' : 'Lose'
                    const matchConstructor = `${match.godName} - ${match.length} mins - K/D/A ${match.kills} / ${match.deaths} / ${match.assists} - Wards: ${match.wards} - ${checkWin}!`
                    embed.addField(match.mode + ' - ' + match.date, matchConstructor)
                }

                msg.channel.send(embed);
            }

            catch(err) {
                console.log(err)
                msg.channel.send('Error: Player does not exist!');
            }
        }
    },
    Mongo: {
        name: '!leader',
        description: 'Returns a leaderboard based on what is called',
        async execute(msg, args) {
            try {
                let playerData = await axios.get('https://api.smite.taylorjohannsen.com/discord/mongo/' + args[1]).then(res => { return res.data }).catch(err => { throw err.message })
                const embed = new RichEmbed()

                embed.setTitle('Leaderboard - ' + upperCase(args[1])) 
                embed.setColor('#ffa500')

                for await (let element of playerData) {
                    if (element.god.name === '') {
                        embed.addField(element.player, element.count)
                    } else {
                        embed.addField(element.player + ' - ' + element.god.name + ' - ' + element.date, element.count)
                    }
                }

                msg.channel.send(embed);
            }

            catch(err) {
                console.log(err)
                msg.channel.send('Error: that Leaderboard does not exist!');
            }
        }
    }
}

function upperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}