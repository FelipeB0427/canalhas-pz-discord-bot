const {  SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painel')
        .setDescription('Injeta o painel de status do servidor Zomboid neste canal.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.reply({ content: '✅ Painel gerado com sucesso! O monitoramento vai começar.', ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('📊 Status do Servidor - Canalhas PZ')
            .setDescription('Sincronizando dados com o servidor...')
            .setColor(0x2b2d31);
        
        const panelMessage = await interaction.channel.send({ embeds: [embed] });

        const configData = {
            channelId: interaction.channelId,
            messageId: panelMessage.id,
        };

        const configPath = path.join(__dirname, '../config/panelConfig.json');
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
    }
};