require('dotenv').config();
const { Client, IntentsBitField, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { ButtonStyle } = require('discord-api-types/v10');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
    ],
});

const roles = [
    {
        id: '1178434821958148117',
        label: '🟥Red',
    },
    {
        id: '1178434940950552606',
        label: '🟩Green',
    },
    {
        id: '1178434998169260123',
        label: '🟦Blue',
    },
]

client.on('ready', async () => {
    try {
        
        const channel = await client.channels.cache.get('1178434821958148117');
        
        if (!channel) return;

        const row = new ActionRowBuilder();

        roles.forEach(role => {
            row.components.push(
                new ButtonBuilder()
                .setCustomId(role.id)
                .setLabel(role.label)
                .setStyle(ButtonStyle.Primary)
            );
        });

        channel.send({
            content: 'Claim or remove a role by clicking the buttons below.',
            components: [row],
        })
        process.exit(0);

    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);