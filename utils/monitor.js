const fs = require('node:fs');
const path = require('node:path');
const { EmbedBuilder } = require('discord.js');
const { sendCommand } = require('./rconManager');

const configPath = path.join(__dirname, '../config/panelConfig.json');

async function updateServerStatus(client) {
    if (!fs.existsSync(configPath)) return;

    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (!configData.channelId || !configData.messageId) return;

    try {
        const channel = await client.channels.fetch(configData.channelId);
        const message = await channel.messages.fetch(configData.messageId);

        const rconResponse = await sendCommand('players');

        let status = '🔴 Offline';
        let playing = '0';
        let color = 0xed4245;

        if (rconResponse !== null) {
            status = '🟢 Online';
            color = 0x57f287;

            const playersMatch = rconResponse.match(/Players: (\d+)/);
            if (playersMatch) {
                playing = playersMatch[1];
            }
        }

        const embed = new EmbedBuilder()
            .setTitle('📊 Status do Servidor - Canalhas PZ')
            .setColor(color)
            .addFields(
                { name: 'Status', value: status, inline: true },
                { name: 'Sobreviventes', value: `${playing}/32`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Sincronização Automática' });

        await message.edit({ embeds: [embed] });
    } catch (error) {
        console.error('❌ Erro ao atualizar o painel de status:', error.message);
    }
}

function startMonitoring(client) {
    console.log('⏱️ Iniciando monitoramento do servidor...');
    updateServerStatus(client);
    setInterval(() => updateServerStatus(client), 60000);
}

module.exports = { startMonitoring };