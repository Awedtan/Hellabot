import { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { operatorDict, } from '../data';
import { buildCostMessage, operatorAutocomplete } from '../utils';

export default {
    data: new SlashCommandBuilder()
        .setName('costs')
        .setDescription('Show an operator\'s elite, skill, mastery, and module level costs')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Operator name')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Cost type')
                .addChoices(
                    { name: 'promotions', value: '0' },
                    { name: 'skills', value: '1' },
                    { name: 'masteries', value: '2' },
                    { name: 'modules', value: '3' }
                )
        ),
    async autocomplete(interaction: AutocompleteInteraction) {
        const value = interaction.options.getFocused().toLowerCase();
        const callback = op => op.data.rarity > 1;
        const arr = operatorAutocomplete(value, callback);
        await interaction.respond(arr);
    },
    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString('name').toLowerCase();
        const page = parseInt(interaction.options.getString('type'));

        if (!operatorDict.hasOwnProperty(name))
            return await interaction.reply({ content: 'That operator doesn\'t exist!', ephemeral: true });

        const op = operatorDict[name];

        if (op.data.rarity <= 1)
            return await interaction.reply({ content: 'That operator has no upgrades!', ephemeral: true });

        const costEmbed = buildCostMessage(op, page);
        await interaction.reply(costEmbed);
    }
}