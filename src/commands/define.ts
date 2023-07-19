import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { definitionDict } from '../data';
import { buildDefineListMessage, buildDefineMessage, defineAutocomplete } from '../utils';

export default {
    data: new SlashCommandBuilder()
        .setName('define')
        .setDescription('Show definitions for in-game terms (use \'list\' to display all in-game terms)')
        .addStringOption(option =>
            option.setName('term')
                .setDescription('Term')
                .setRequired(true)
                .setAutocomplete(true)
        ),
    async autocomplete(interaction: AutocompleteInteraction) {
        const value = interaction.options.getFocused().toLowerCase();
        const arr = defineAutocomplete(value);
        await interaction.respond(arr);
    },
    async execute(interaction: ChatInputCommandInteraction) {
        const term = interaction.options.getString('term').toLowerCase();

        if (term === 'list') {
            const defineListEmbed = buildDefineListMessage();
            await interaction.reply(defineListEmbed);
        }
        else {
            if (!definitionDict.hasOwnProperty(term))
                return await interaction.reply({ content: 'That term doesn\'t exist!', ephemeral: true });

            const definition = definitionDict[term];
            const defineEmbed = buildDefineMessage(definition);
            await interaction.reply(defineEmbed);
        }
    }
}