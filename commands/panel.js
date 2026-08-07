const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('painel')
        .setDescription('Injeta o painel de status do servidor Zomboid neste canal.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const configPath = path.join(__dirname, '../config/panelConfig.json');
        const dirPath = path.dirname(configPath);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        if (fs.existsSync(configPath)) {
            try {
                const oldConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (oldConfig.channelId && oldConfig.messageId) {
                    const oldChannel = await interaction.client.channels.fetch(oldConfig.channelId).catch(() => null);
                    if (oldChannel) {
                        const oldMessage = await oldChannel.messages.fetch(oldConfig.messageId).catch(() => null);
                        if (oldMessage) await oldMessage.delete();
                    }
                }
            } catch (error) {
                console.log('Painel antigo não encontrado ou já apagado manualmente.');
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('📊 Status do Servidor - Canalhas PZ')
            .setDescription('Sincronizando dados com o servidor...')
            .setColor(0x2b2d31); 

        const painelMessage = await interaction.channel.send({ embeds: [embed] });

        const configData = {
            channelId: interaction.channelId,
            messageId: painelMessage.id
        };

        fs.writeFileSync(configPath, JSON.stringify(configData, null, 2));
        
        await interaction.editReply({ content: '✅ Novo painel gerado! O antigo foi substituído.' });
    }
};