const { Rcon } = require('rcon-client');
require('dotenv').config();

/**
 * Função assíncrona para enviar comandos ao servidor de Project Zomboid via RCON.
 * @param {string} command - O comando a ser executado (ex: 'servermsg "Ola!"')
 * @returns {Promise<string|null>} - A resposta do servidor ou null em caso de erro.
 */

async function sendCommand(command) {
    try {
        const rcon = await Rcon.connect({
            host: process.env.RCON_HOST,
            port: parseInt(process.env.RCON_PORT),
            password: process.env.RCON_PASSWORD,
        });

        const response = await rcon.send(command);
        
        await rcon.end();
        
        return response;
    } catch (error) {
        console.error(`❌ Erro ao enviar comando RCON (${command}):`, error.message);
        return null;
    }
}

module.exports = { sendCommand };