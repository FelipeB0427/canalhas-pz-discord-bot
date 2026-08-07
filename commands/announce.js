const { SlashCommandBuilder } = require('discord.js');
const { sendCommand } = require('../utils/rconManager');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anunciar')
        .setDescription('Envia uma mensagem global para o servidor de Zomboid')
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription("A mensagem que aparecerá para todos os jogadores no servidor")
                .setRequired(true)),
    
    async execute(interaction) {
        await interaction.deferReply(); // Defer a resposta para ganhar mais tempo

        const message = interaction.options.getString('mensagem');
        const rconResponse = await sendCommand(`servermsg "${message}"`);

        if (rconResponse !== null) {
            await interaction.editReply(`✅ Anúncio enviado com sucesso para os sobreviventes!`);
        } else {
            await interaction.editReply(`❌ Falha ao conectar com o servidor. Verifique o console.`);
        }
    },
};