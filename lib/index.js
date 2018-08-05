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

    if (!executed) { return undefined; }

    let [match, block, elem, modName, modVal] = executed;

    if(modName && !elem && !block) elem = scope.elem;
    if(!block) block = scope.block;

    return new BemEntityName({ block, elem, mod: modName && {
        name: modName,
        val: modVal  || true
    }});
}

module.exports = postcss.plugin('pobem', (opts) => {
    const wordPattern = '[a-z0-9A-Z]+';
    const delims = {
        elem : '__',
        mod : {
            name : '_',
            val : '_'
        }
    };

    const block = `(${wordPattern})?`;
    const elem = `(?:${delims.elem}(${wordPattern}))?`;
    const modName = `(?:${delims.mod.name}(${wordPattern}))?`;
    const modVal = `(?:${delims.mod.val}(${wordPattern}))?`;
    const mod = modName + modVal;

    const regex = new RegExp(block + elem + mod);

    return (css) => {
        css.walkRules((rule) => {
            let scope;
            rule.selector = selectorParser(nodes => {
                nodes.walk(node => {
                    if(node.type === 'selector') return;
                    const entityName = parse(node.value, regex, scope);

                    if(!['elem', 'blockMod', 'elemMod'].includes(entityName.type) && node.type === 'tag') {
                        return;
                    }

                    scope = entityName;

                    if(['class', 'tag'].includes(node.type)) {
                        node.replaceWith(
                            selectorParser.className({ value : entityName.id })
                        );
                    }
                });

            }).processSync(rule.selector);
        });
    }
});
