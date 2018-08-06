const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');
const BemEntityName = require('@bem/sdk.entity-name');

/**
 * Parse entity name
 * @param {string} str source
 * @param {RegExp} regex
 * @param {?BemEntityName} scope current scope
 * @returns {BemEntityName}
 */
function parse(str, regex, scope) {
    const executed = regex.exec(str);

    if (!executed) {
        return null;
    }

    let [ match, block, elem, modName, modVal ] = executed;

    if(modName && !elem && !block) elem = scope.elem;
    if(!block) block = scope.block;

    return new BemEntityName({ block, elem, mod: modName && {
        name: modName,
        val: modVal  || true
    }});
}

/**
 * Get parent types list
 * @returns {String[]}
 */
const getParentTypes = (node) => {
    const list = [];
    while(node = node.parent) {
        list.push(node.type)
    };

    return list;
}

module.exports = postcss.plugin('pobem', (opts) => {
    const wordPattern = '[a-z0-9A-Z]+';
    const delims = {
        elem : '__',
        mod : { name : '_', val : '_' }
    };

    const block = `(${wordPattern})?`;
    const elem = `(?:${delims.elem}(${wordPattern}))?`;
    const modName = `(?:${delims.mod.name}(${wordPattern}))?`;
    const modVal = `(?:${delims.mod.val}(${wordPattern}))?`;
    const mod = modName + modVal;
    const regex = new RegExp(block + elem + mod);
    const bemTypes = ['elem', 'blockMod', 'elemMod'];

    return (css) => css.walkRules(rule => {
        let scope;
        rule.selector = selectorParser(root => {
            root.walk(node => {
                if(node.type === 'selector') return;
                const entityName = parse(node.value, regex, scope);

                if(!bemTypes.includes(entityName.type) && node.type === 'tag') {
                    return;
                }

                const parentTypes = getParentTypes(node);
                if(!parentTypes.includes('pseudo') && !parentTypes.includes('attribute')) {
                    scope = entityName;
                }

                if(['class', 'tag'].includes(node.type)) {
                    node.replaceWith(
                        selectorParser.className({ value : entityName.id })
                    );
                }
            });

        }).processSync(rule.selector);
    });
});
