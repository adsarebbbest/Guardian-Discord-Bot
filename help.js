module.exports = {
  'help': {
    description: 'Shows the list of commands or help on specified command.',
    format: 'help [command-name]'
  },
  'ping': {
    description: 'Checks connectivity with discord\'s servers.',
    format: 'ping'
  },
  'say': {
    aliases: ['repeat'],
    description: 'Repeats whatever is said.',
    format: 'say <message>'
  },
  'ban': {
    description: 'ban a user',
    format: 'ban <@user>'
  },
  'kick': {
    description: 'kick a user',
    format: 'kick <@user>'
  },
  'slowmode': {
    description: 'sets slow mode',
    format: 'slowmode <time>'
  },
  'purge': {
    aliases: ['clear'],
    description: 'clear messages',
    format: 'purge <messages>'
  },
  'invite': {
    description: 'invite the bot to your server',
    format: 'invite'
  }
}