require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { sendCommand } = require('./utils/rconManager');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', (c) => {
    console.log(`✅ Sucesso! O bot ${c.user.tag} está online e operacional.`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!anunciar')) {
        const announceText = message.content.replace('!anunciar', '');
        const msgCarregando = await message.reply('⏳ Enviando anúncio para o servidor...');
        const rconResponse = await sendCommand(`servermsg "${announceText}"`);

        if (rconResponse !== null) {
            await msgCarregando.edit(`✅ Anúncio enviado com sucesso para os sobreviventes!`);
        } else {
            await msgCarregando.edit(`❌ Falha ao conectar com o servidor. Verifique o console.`);
        }
   }
});

client.login(process.env.DISCORD_TOKEN);