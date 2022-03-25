const Discord = require('discord.js');
const client = new Discord.Client({ intents: ["GUILDS","GUILD_MEMBERS","GUILD_MESSAGES","GUILD_VOICE_STATES"] 
})




const {DisTube} = require('distube');
const {SpotifyPlugin} = require('@distube/spotify');
const {SoundCloudPlugin} = require('@distube/soundcloud');

const distube = new DisTube(client, { 
    youtubeDL: false, 
    plugins: [new SpotifyPlugin(), new SoundCloudPlugin()],
    leaveOnEmpty: true,
    leaveOnStop: true

})

client.on('ready', () => {
    console.log('${client.user.tag} has logged in.');
})

/*
client.once('ready', () => {
    console.log('uanama Bot Online!')
});
*/

client.on('message', async (message) => {

    /*if( message.content == "ops" ){
        if( !message.member.voice.channel ){
            return message.channel.send('Entra in un canale vocale e riscrivi il comando ops.')
        }else{
            message.member.se
            message.member.id.voice.setChannel(874259489606492228);
            message.member.id.voice.setChannel(874259489606492229);
            message.member.id.voice.setChannel(898248263797440564);
            message.member.id.voice.setChannel(880582204877590528);
            message.member.id.voice.setChannel(902847813967306782);
            message.member.id.voice.setChannel(938382556477411349);
            
            return message.channel.send('ops.');
        }
    }*/

    /*if( message.content == "!kevin" ){
        return message.channel.send('Kevin ha il pisello piccolo.')
        
    }*/

    if(message.author.bot) return;

    //play command
    if(message.content.startsWith("!play")){

        const voiceChannel = message.member.voice.channel
        if(!voiceChannel){
            return message.channel.send("You are not in a voice channel.")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if( voiceChannelBot && voiceChannel.id != voiceChannelBot.id ){
            return message.channel.send("Someone else is already using the Bot.")
        }

        let args = mesage.content.split(/\s+/)
        let query = args.slice(1).join(" ")

        if(!query){
            return message.channel.send("You must state something to play.")
        }

        distube.play(voiceChannelBot || voiceChannel, query, {
            member: message.member,
            textChannel: message.channel,
            message: message
        })
    }

    //pause command
    if(message.content == "!pause"){

        const voiceChannel = message.member.voice.channel
        if(!voiceChannel){
            return message.channel.send("You are not in a voice channel.")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if( voiceChannelBot && voiceChannel.id != voiceChannelBot.id ){
            return message.channel.send("Someone else is already using the Bot.")
        }

        try{
            distube.pause(message)
        }catch{
            return message.channel.send("No songs playing or song already paused")
        }
        
        message.channel.send("Song paused")
    }

    //resume command
    if(message.content == "!resume"){

        const voiceChannel = message.member.voice.channel
        if(!voiceChannel){
            return message.channel.send("You are not in a voice channel.")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if( voiceChannelBot && voiceChannel.id != voiceChannelBot.id ){
            return message.channel.send("Someone else is already using the Bot.")
        }

        try{
            distube.resume(message)
        }catch{
            return message.channel.send("No songs playing or song already playing")
        }
        
        message.channel.send("Song resumed")
    }

    //queue command
    if(message.content == "!queue"){

        const voiceChannel = message.member.voice.channel
        if(!voiceChannel){
            return message.channel.send("You are not in a voice channel.")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if( voiceChannelBot && voiceChannel.id != voiceChannelBot.id ){
            return message.channel.send("Someone else is already using the Bot.")
        }

        let queue = distube.getQueue(message)

        let totPage = Math.ceil(queue.song.length / 10)
        let page = 1

        let songsList = ""

        for( let i = 10 * (page -1) ; i<10*page ; i++ ){
            if(queue.songs[i]){
                songsList += `${i + 1}. **${queue.songs[i].name.length <= 100 ? queue.songs[i].name : `${queue.songs[i].name.slice(0, 100)}...`}** - ${queue.songs[i].formattedDuration}\r`
            }
        }
        
        let embed = new Discord.MessageEmbed()
            .addField("Queue", songsList)
            .setFooter({ text: `Page ${page}/${totPage}` })

        let button1 = new Discord.MessageButton()
            .setLabel("Back")
            .setStyle("PRIMARY")
            .setCustomId("back")

        let button2 = new Discord.MessageButton()
            .setLabel("Next")
            .setStyle("PRIMARY")
            .setCustomId("next")

        if (page == 1) button1.setDisabled()
        if (page == totPage) button2.setDisabled()

        let row = new Discord.MessageActionRow()
            .addComponents(button1)
            .addComponents(button2)

        message.channel.send({ embeds: [embed], components: [row] })
            .then(msg => {
                const collector = msg.createMessageComponentCollector()

                collector.on("collect", i => {
                    i.deferUpdate()

                    if (i.user.id != message.author.id) return i.reply({ content: "This button is not yours", ephemeral: true })

                    if (i.customId == "back") {
                        page--
                        if (page < 1) page = 1
                    }
                    if (i.customId == "next") {
                        page++
                        if (page > totPage) page = totPage
                    }

                    let songsList = ""
                    for (let i = 10 * (page - 1); i < 10 * page; i++) {
                        if (queue.songs[i]) {
                            songsList += `${i + 1}. **${queue.songs[i].name.length <= 100 ? queue.songs[i].name : `${queue.songs[i].name.slice(0, 100)}...`}** - ${queue.songs[i].formattedDuration}\r`
                        }
                    }

                    let embed = new Discord.MessageEmbed()
                        .addField("Queue", songsList)
                        .setFooter({ text: `Page ${page}/${totPage}` })

                    let button1 = new Discord.MessageButton()
                        .setLabel("Back")
                        .setStyle("PRIMARY")
                        .setCustomId("back")

                    let button2 = new Discord.MessageButton()
                        .setLabel("Next")
                        .setStyle("PRIMARY")
                        .setCustomId("next")

                    if (page == 1) button1.setDisabled()
                    if (page == totPage) button2.setDisabled()

                    let row = new Discord.MessageActionRow()
                        .addComponents(button1)
                        .addComponents(button2)

                    msg.edit({ embeds: [embed], components: [row] })
                })
            })
    }

    if (message.content == "!skip") {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send("You are not in a voice channel.")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return message.channel.send("Someone else is already listening to some music.")
        }

        try {
            distube.skip(message)
                .catch(() => { return message.channel.send("No songs playing or next song not present.") })
        } catch {
            return message.channel.send("No songs playing or next song not present.")
        }

        message.channel.send("Song skipped")
    }

    if (message.content == "!previous") {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send("You are not in a voice channel.")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return message.channel.send("Someone else is already listening to some music.")
        }

        try {
            distube.previous(message)
                .catch(() => { return message.channel.send("No songs playing or back song not present.") })
        } catch {
            return message.channel.send("No songs playing or back song not present.")
        }

        message.channel.send("Previous song")
    }

    if (message.content == "!stop") {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) {
            return message.channel.send("You are not in a voice channel.")
        }

        const voiceChannelBot = message.guild.channels.cache.find(x => x.type == "GUILD_VOICE" && x.members.has(client.user.id))
        if (voiceChannelBot && voiceChannel.id != voiceChannelBot.id) {
            return message.channel.send("Someone else is already listening to some music.")
        }

        try {
            distube.stop(message)
                .catch(() => { return message.channel.send("No songs playing.") })
        } catch {
            return message.channel.send("No songs playing.")
        }

        message.channel.send("Queue stopped")
    }

})

distube.on("addSong", (queue, song) => {
    var embed = new Discord.MessageEmbed()
        .setTitle("Song added")
        .addField("Song", song.name)

    queue.textChannel.send({ embeds: [embed] })
})

distube.on("playSong", (queue, song) => {
    var embed = new Discord.MessageEmbed()
        .setTitle("Playng song...")
        .addField("Song", song.name)
        .addField("Requested by", song.user.toString())

    queue.textChannel.send({ embeds: [embed] })
})

distube.on("searchNoResult", (message, query) => {
    message.channel.send("Song not found...")
})




client.login(process.env.token);


