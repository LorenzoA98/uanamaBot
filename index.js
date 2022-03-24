const { Client, Intents } = require('discord.js');
const allIntents = new Intents(32767);
const client = new Client({ allIntents });
const prefix = '!';

const Distube = require('distube');
const distube = new Distube(client, { 
    searchSongs: false, 
    emitNewSongOnly: true
});

client.on('ready', () => {
    console.log('${client.user.tag} has logged in.');
});

/*
client.once('ready', () => {
    console.log('uanama Bot Online!')
});
*/

client.on('message', async (message) => {

    if( message.content == "ops" ){
        if( !message.member.voice.channel ){
            return message.channel.send('Entra in un canale vocale e riscrivi il comando ops.')
        }else{
            message.member.id.voice.setChannel(874259489606492228)
            message.member.id.voice.setChannel(874259489606492229)
            message.member.id.voice.setChannel(898248263797440564)
            message.member.id.voice.setChannel(880582204877590528)
            message.member.id.voice.setChannel(902847813967306782)
            message.member.id.voice.setChannel(938382556477411349)
            
            return message.channel.send('ops.')
        }
    }

    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    // Queue status template
    const status = (queue) => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

    // DisTube event listeners, more in the documentation page
    distube
        .on("playSong", (message, queue, song) => message.channel.send(
            `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user.tag}\n${status(queue)}`
        ))
        .on("addSong", (message, queue, song) => message.channel.send(
            `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user.tag}`
        ))
        .on("playList", (message, queue, playlist, song) => message.channel.send(
            `Play \`${playlist.title}\` playlist (${playlist.total_items} songs).\nRequested by: ${song.user.tag}\nNow playing \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`
        ))
        .on("addList", (message, queue, playlist) => message.channel.send(
            `Added \`${playlist.title}\` playlist (${playlist.total_items} songs) to queue\n${status(queue)}`
        ))
        // DisTubeOptions.searchSongs = true
        .on("searchResult", (message, result) => {
            let i = 0;
            message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`);
        })
        // DisTubeOptions.searchSongs = true
        .on("searchCancel", (message) => message.channel.send(`Searching canceled`))
        .on("error", (message, err) => message.channel.send(
            "An error encountered: " + err
        ));

    if( command == "play"){
        if( !message.member.voice.channel ) return message.channel.send('You are not in a voice channel.');
        if( !args[0] ) return message.channel.send('You must state something to play.');
        distube.play(message, args.join(" "));
    }
    if( command == "stop"){
        const bot = message.guild.members.cache.get(client.user.id);
        if( !message.member.voice.channel ) return message.channel.send('You are not in a voice channel.');
        if( bot.voice.channel !== message.member.voice.channel ) return message.channel.send('You are not in the same voice channel as the bot.');
        distube.stop(message);
        message.channel.send('You have stopped the music');
    }
});

client.login(process.env.token);
