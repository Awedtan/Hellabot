import { CCStage, Definition, Enemy, Item, Operator, RogueRelic, RogueStage, RogueVariation, SandboxStage, Skin, Stage } from "hella-types";
import { SingleParams, getAllDefinitions, getAllEnemies, getAllItems, getAllOperators, getAllStageArrs, getAllToughStageArrs, getRogueTheme, getSandboxAct, getSkinArr } from "./api";
const { gameConsts } = require('../constants');

type AutocompleteParams = Omit<SingleParams, 'exclude'>;
const limit = 6;
const splitMatch = (str: string, query: string) => str.toLowerCase().includes(query.toLowerCase()) || str.toLowerCase().split('\'').join('').includes(query.toLowerCase());

export async function autocompleteCc(query: string, callback: (e: CCStage['const']) => boolean = () => true) {
    const matchQuery = (stage: CCStage['const']) => splitMatch(stage.name, query) || splitMatch(stage.location, query) || splitMatch(stage.levelId.split('/')[2], query);

    const filteredArr: CCStage['const'][] = [];
    const ccStages: CCStage['const'][] = gameConsts.ccStages;
    let i = 0;
    for (const stage of ccStages) {
        if (i >= limit) break;
        if (filteredArr.includes(stage) || !matchQuery(stage) || !callback(stage)) continue;
        filteredArr.push(stage);
        i++;
    }

    const mappedArr = filteredArr.map(stage => ({ name: `${stage.location} - ${stage.name}`, value: stage.levelId.split('/')[2] }));

    return mappedArr;
}
export async function autocompleteDefine({ query, include = [] }: AutocompleteParams, callback: (e: Definition) => boolean = () => true) {
    const matchQuery = (define: Definition) => splitMatch(define.termName, query);
    const requiredInclude = ['termName'];

    const definitionArr = await getAllDefinitions({ limit, include: requiredInclude.concat(include) });
    const filteredArr: Definition[] = [];
    for (const define of definitionArr) {
        if (filteredArr.includes(define) || !matchQuery(define) || !callback(define)) continue;
        filteredArr.push(define);
    }
    const mappedArr = filteredArr.map(define => ({ name: define.termName, value: define.termName }));

    return mappedArr;
}
export async function autocompleteEnemy({ query, include = [] }: AutocompleteParams, callback: (e: Enemy) => boolean = () => true) {
    const matchQuery = (enemy: Enemy) => splitMatch(enemy.excel.name, query) || splitMatch(enemy.excel.enemyIndex, query);
    const requiredInclude = ['excel.name', 'excel.enemyIndex', 'excel.enemyId'];

    const enemyArr = await getAllEnemies({ limit, include: requiredInclude.concat(include) });
    const filteredArr: Enemy[] = [];
    for (const enemy of enemyArr) {
        if (filteredArr.includes(enemy) || !matchQuery(enemy) || !callback(enemy)) continue;
        filteredArr.push(enemy);
    }
    const mappedArr = filteredArr.map(enemy => ({ name: `${enemy.excel.enemyIndex} - ${enemy.excel.name}`, value: enemy.excel.enemyId }));

    return mappedArr;
}
export async function autocompleteRogueRelic(theme: number, { query, include = [] }: AutocompleteParams, callback: (e: RogueRelic) => boolean = () => true) {
    const matchQuery = (relic: RogueRelic) => splitMatch(relic.name, query);
    const requiredInclude = ['relicDict'];

    const rogueTheme = await getRogueTheme({ query: theme.toString(), include: requiredInclude.concat(include) });
    const filteredArr: RogueRelic[] = [];
    let i = 0;
    for (const relic of Object.values(rogueTheme.relicDict)) {
        if (i >= limit) break;
        if (filteredArr.includes(relic) || !matchQuery(relic) || !callback(relic)) continue;
        filteredArr.push(relic);
        i++;
    }
    const mappedArr = filteredArr.map(relic => ({ name: relic.name, value: relic.name }));

    return mappedArr;
}
export async function autocompleteRogueStage(theme: number, { query, include = [] }: AutocompleteParams, callback: (e: RogueStage) => boolean = () => true) {
    const matchQuery = (stage: RogueStage) => splitMatch(stage.excel.name, query) || splitMatch(stage.excel.code, query);
    const requiredInclude = ['stageDict'];

    const rogueTheme = await getRogueTheme({ query: theme.toString(), include: requiredInclude.concat(include) });
    const filteredArr: RogueStage[] = [];
    let i = 0;
    for (const stage of Object.values(rogueTheme.stageDict)) {
        if (i >= limit) break;
        if (filteredArr.some(s => s.excel.id === stage.excel.id) || !matchQuery(stage) || !callback(stage)) continue;
        filteredArr.push(stage);
        i++;
    }
    const mappedArr = filteredArr.map(stage => ({ name: `${stage.excel.code} - ${stage.excel.name}`, value: stage.excel.name }));

    return mappedArr;
}
export async function autocompleteRogueToughStage(theme: number, { query, include = [] }: AutocompleteParams, callback: (e: RogueStage) => boolean = () => true) {
    const matchQuery = (stage: RogueStage) => splitMatch(stage.excel.name, query) || splitMatch(stage.excel.code, query);
    const requiredInclude = ['toughStageDict'];

    const rogueTheme = await getRogueTheme({ query: theme.toString(), include: requiredInclude.concat(include) });
    const filteredArr: RogueStage[] = [];
    let i = 0;
    for (const stage of Object.values(rogueTheme.toughStageDict)) {
        if (i >= limit) break;
        if (filteredArr.some(s => s.excel.id === stage.excel.id) || !matchQuery(stage) || !callback(stage)) continue;
        filteredArr.push(stage);
        i++;
    }
    const mappedArr = filteredArr.map(stage => ({ name: `${stage.excel.code} - ${stage.excel.name}`, value: stage.excel.name }));

    return mappedArr;
}
export async function autocompleteRogueVariation(theme: number, { query, include = [] }: AutocompleteParams, callback: (e: RogueVariation) => boolean = () => true) {
    const matchQuery = (variation: RogueVariation) => splitMatch(variation.outerName, query);
    const requiredInclude = ['variationDict'];

    const rogueTheme = await getRogueTheme({ query: theme.toString(), include: requiredInclude.concat(include) });
    const filteredArr: RogueVariation[] = [];
    let i = 0;
    for (const variation of Object.values(rogueTheme.variationDict)) {
        if (i >= limit) break;
        if (filteredArr.includes(variation) || !matchQuery(variation) || !callback(variation)) continue;
        filteredArr.push(variation);
        i++;
    }
    const mappedArr = filteredArr.map(variation => ({ name: variation.outerName, value: variation.outerName }));

    return mappedArr;
}
export async function autocompleteSandboxStage(act: number, { query, include = [] }: AutocompleteParams, callback: (e: SandboxStage) => boolean = () => true) {
    const matchQuery = (stage: SandboxStage) => splitMatch(stage.excel.name, query) || splitMatch(stage.excel.code, query);
    const requiredInclude = ['stageDict'];

    const sandboxAct = await getSandboxAct({ query: act.toString(), include: requiredInclude.concat(include) });
    const filteredArr: SandboxStage[] = [];
    let i = 0;
    for (const stage of Object.values(sandboxAct.stageDict)) {
        if (i >= limit) break;
        if (filteredArr.some(s => s.excel.name === stage.excel.name) || !matchQuery(stage) || !callback(stage)) continue;
        filteredArr.push(stage);
        i++;
    }
    const mappedArr = filteredArr.map(stage => ({ name: `${stage.excel.code} - ${stage.excel.name}`, value: stage.excel.name }));

    return mappedArr;
}
export async function autocompleteSkin(op: Operator, { query, include = [] }: AutocompleteParams, callback: (e: Skin) => boolean = () => true) {
    const matchQuery = (skin: Skin) => splitMatch(skin.displaySkin.skinName ?? 'default', query);
    const requiredInclude = ['displaySkin.skinName', 'skinId'];

    const skinArr = await getSkinArr({ query: op.id, include: requiredInclude.concat(include) });
    if (!skinArr || skinArr.length === 0) return [];
    const filteredArr: Skin[] = [];
    let i = 0;
    for (const skin of skinArr) {
        if (i >= limit) break;
        if (filteredArr.some(s => s.displaySkin.skinName === skin.displaySkin.skinName) || !matchQuery(skin) || !callback(skin)) continue;
        filteredArr.push(skin);
        i++;
    }
    const mappedArr = filteredArr.map(skin => ({ name: skin.displaySkin.skinName ?? 'Default', value: skin.displaySkin.skinName ? skin.skinId.split('@').join('_') : 'default' }));

    return mappedArr;
}
export async function autocompleteItem({ query, include = [] }: AutocompleteParams, callback: (e: Item) => boolean = () => true) {
    const matchQuery = (item: Item) => splitMatch(item.data.name, query);
    const requiredInclude = ['data.name'];

    const itemArr = await getAllItems({ limit, include: requiredInclude.concat(include) });
    const filteredArr: Item[] = [];
    for (const item of itemArr) {
        if (filteredArr.includes(item) || !matchQuery(item) || !callback(item)) continue;
        filteredArr.push(item);
    }
    const mappedArr = filteredArr.map(item => ({ name: item.data.name, value: item.data.name }));

    return mappedArr;
}
export async function autocompleteOperator({ query, include = [] }: AutocompleteParams, callback: (e: Operator) => Boolean = () => true) {
    const matchQuery = (op: Operator) => splitMatch(op.data.name, query);
    const requiredInclude = ['data.name'];

    const operatorArr = await getAllOperators({ limit, include: requiredInclude.concat(include) });
    const filteredArr: Operator[] = [];
    for (const op of operatorArr) {
        if (filteredArr.includes(op) || !matchQuery(op) || !callback(op)) continue;
        filteredArr.push(op);
    }
    const mappedArr = filteredArr.map(op => ({ name: op.data.name, value: op.data.name }));

    return mappedArr;
}
export async function autocompleteStage({ query, include = [] }: AutocompleteParams, callback: (e: Stage) => boolean = () => true) {
    const matchQuery = (stage: Stage) => splitMatch(stage.excel.name, query) || splitMatch(stage.excel.code, query);
    const requiredInclude = ['excel.name', 'excel.code', 'excel.stageId'];

    const stageArrArr = await getAllStageArrs({ limit, include: requiredInclude.concat(include) });
    const filteredArr: Stage[] = [];
    for (const stageArr of stageArrArr) {
        for (const stage of stageArr) {
            if (filteredArr.some(s => s.excel.stageId === stage.excel.stageId) || !matchQuery(stage) || !callback(stage)) continue;
            filteredArr.push(stage);
        }
    }
    const mappedArr = filteredArr.map(stage => ({ name: `${stage.excel.code} - ${stage.excel.name}`, value: stage.excel.stageId }));

    return mappedArr;
}
export async function autocompleteToughStage({ query, include = [] }: AutocompleteParams, callback: (e: Stage) => boolean = () => true) {
    const matchQuery = (stage: Stage) => splitMatch(stage.excel.name, query) || splitMatch(stage.excel.code, query);
    const requiredInclude = ['excel.name', 'excel.code', 'excel.stageId'];

    const stageArrArr = await getAllToughStageArrs({ limit, include: requiredInclude.concat(include) });
    const filteredArr: Stage[] = [];
    for (const stageArr of stageArrArr) {
        for (const stage of stageArr) {
            if (filteredArr.some(s => s.excel.stageId === stage.excel.stageId) || !matchQuery(stage) || !callback(stage)) continue;
            filteredArr.push(stage);
        }
    }
    const mappedArr = filteredArr.map(stage => ({ name: `${stage.excel.code} - ${stage.excel.name}`, value: stage.excel.stageId }));

    return mappedArr;
}