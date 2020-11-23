const { Client, MessageEmbed } = require('discord.js');
const config = require('./config');
const commands = require('./help');
let member;
let reason;
let time;
let msg;
let embed;

let bot = new Client({
  fetchAllMembers: true, // Remove this if the bot is in large guilds.
  presence: {
    status: 'online',
    activity: {
      name: `${config.prefix}help`,
      type: 'LISTENING'
    }
  }
});

bot.on('ready', () => console.log(`Logged in as ${bot.user.tag}.`));

bot.on('message', async message => {
  // Check for command
  if (message.content.startsWith(config.prefix)) {
    let args = message.content.slice(config.prefix.length).split(' ');
    let command = args.shift().toLowerCase();
    switch (command) {
      case 'sm':
        if(args.length > 0) {
          message.delete();
          message.channel.send(args.join(' '));
        }
        break;
      case 'clear':
      case 'purge':
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Why are you trying to delete other people messages?");
        const deleteCount = parseInt(args[0], 10); 

        if (!deleteCount || deleteCount == 0 || deleteCount > 100) return message.channel.send(
        "Specify how many messages you would like to purge. Or you're trying to break me (min 0, max 100)"
        );
        message.channel
        .bulkDelete(deleteCount+1) 
        .catch(error =>
        message.channel.send(`Huh, messages couldn't be purged because of: ${error}.`) 
        );
        msg = await message.reply(`${deleteCount} messages were deleted`);
        setTimeout(() => {
          msg.delete();
        }, 1000);
        break;
      case 'invite':
        msg = await message.reply(`${message.author},Generating invite link...`)
        await msg.edit('https://discord.com/api/oauth2/authorize?client_id=767900370038816779&permissions=8&scope=bot');
        break;
      case 'slowmode':
        time = message.content.split(' ').slice(1).join(' ');
        if(!time) return message.channel.send("Are you trying to break me? Won't work.");
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Hey, why are you trying to set slow mode without perms?");
        message.channel.setRateLimitPerUser(parseInt(time));
        message.channel.send(`So NOW, people can only send messages every ${time} seconds`);
        break;
      case 'ban':
        if(!message.member.hasPermission("BAN_MEMBERS")) {
          message.channel.send("Stop trying to run this command, you can't use it")
          break;
        }
        member = message.mentions.members.first(); 
        if (!member) return message.channel.send("Specify a valid user if you're gonna ban someone."); 
        if (!member.banable) return message.channel.send("Umm why did you try to ban a moderator/admin?");

        reason = args.slice(1).join(" "); 
        if (!reason) reason = "No reason provided."; 

        await member
        .ban(reason) 
        .catch(error => 
          message.channel.send(`This user will be hard to ban because of: ${error}.`)
        );
       message.channel.send(`${member.user.tag} will never return to this server (unless they use alts)`); 
       break;
      case 'ping':
        msg = await message.reply('Pinging...');
        await msg.edit(`PONG! Message round-trip took ${Date.now() - msg.createdTimestamp}ms.`);
        break;
      case 'kick':
        if(!message.member.hasPermission("KICK_MEMBERS")) {
          return message.channel.send(`Hey, you can't run this command`)
        }
        member = message.mentions.members.first(); 
        if (!member) return message.channel.send("Specify a valid user if you're gonna kick someone."); 
        if (!member.banable) return message.channel.send("Did you just try to kick a moderator/admin?");

        reason = args.slice(1).join(" "); 
        if (!reason) reason = "No reason provided."; 

        await member
        .ban(reason) 
        .catch(error => 
          message.channel.send(`This user is gonna be hard to kick because of: ${error}.`)
        );
       message.channel.send(`Successfully kicked ${member.user.tag}.`); 
        break;
      case 'say':
      case 'repeat':
        if (args.length > 0) {
          if(args.join(' ') == "im dumb" || args.join(' ') == "im stupid") return message.channel.send("yeah we know")
          message.channel.send(args.join(` `)+`\n\n-${message.member.user.tag}`);
        } else {
          message.reply('You want me to say nothing?');
        }
        break;
      /* Unless you know what you're doing, don't change this command. */
      case 'help':
        embed =  new MessageEmbed()
          .setTitle('HELP MENU')
          .setColor('ORANGE')
          .setFooter(`Requested by: ${message.member ? message.member.displayName : message.author.username}`, message.author.displayAvatarURL())
          .setThumbnail(bot.user.displayAvatarURL());
        if (!args[0])
          embed
            .setDescription(Object.keys(commands).map(command => `\`${command.padEnd(Object.keys(commands).reduce((a, b) => b.length > a.length ? b : a, '').length)}\` :: ${commands[command].description}`).join('\n'));
        else {
          if (Object.keys(commands).includes(args[0].toLowerCase()) || Object.keys(commands).map(c => commands[c].aliases || []).flat().includes(args[0].toLowerCase())) {
            let command = Object.keys(commands).includes(args[0].toLowerCase())? args[0].toLowerCase() : Object.keys(commands).find(c => commands[c].aliases && commands[c].aliases.includes(args[0].toLowerCase()));
            embed
              .setTitle(`COMMAND - ${command}`)

            if (commands[command].aliases)
              embed.addField('Command aliases', `\`${commands[command].aliases.join('`, `')}\``);
            embed
              .addField('DESCRIPTION', commands[command].description)
              .addField('FORMAT', `\`\`\`${config.prefix}${commands[command].format}\`\`\``);
          } else {
            embed
              .setColor('RED')
              .setDescription('This command does not exist. Please use the help command without specifying any commands to list them all.');
          }
        }
        message.channel.send(embed);
        break;
    }
  }
  if(message.content.search(`<@750056391783481404>`) != -1) {
    if(!message.author.bot) {
      message.delete();
      message.channel.send(`**${message.author}, You cannot ping adsarebbbest :angry:**`);
    }
  }
});

require('./server')();
bot.login(config.token);