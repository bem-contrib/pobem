import postcss from 'postcss';

const modDelim = process.env.REBEM_MOD_DELIM || '_';
const elemDelim = process.env.REBEM_ELEM_DELIM || '__';

function buildSelector (block) {
    let selector = '.';

    if (block.blockName) {
        selector += block.blockName;
    }
    if (block.elemName) {
        selector += elemDelim + block.elemName;
    }
    if (block.modName) {
        selector += modDelim + block.modName;
    }

    return selector;
}

export default postcss.plugin('pobems', () => (css) => {
    css.walkRules((rule) => {
        rule.selector = rule.selector
            .replace(/(:block\(.+)/g, (match, rawSelector) => {

                // ":block(b):mod(m v) div :block(b2)" -> [":block(b):mod(m v)", "div", "block(b2)"]
                const groups = rawSelector.split(/\s+(?!\w+\))/gi);

                const re = /:(block|elem|mod)\(([\w-\s]+)\)(\s+)?/g;
                const blockDecl = { blockName: false, elemName: false, modName: false };

                // Convert all groups to CSS selectors
                // :block(b):mod(m v) -> .b_m_v

                const result = [];

                for (const group of groups) {
                    if (!group.match(re)) {
                        result.push(group);
                        continue;
                    }

                    let selector = '';
                    let mathes = null;

                    while ((mathes = re.exec(group)) !== null) {

                        if (mathes[1] === 'block') {
                            blockDecl.blockName = mathes[2];
                        }

                        if (mathes[1] === 'elem') {
                            blockDecl.elemName = mathes[2];
                        }

                        if (mathes[1] === 'mod') {
                            blockDecl.modName = mathes[2].replace(' ', modDelim);
                            selector += buildSelector(blockDecl);
                        }

                    }
                    if (!blockDecl.modName) {
                        selector += buildSelector(blockDecl);
                    }

                    result.push(selector);
                }

                return result.join(' ');
            });
    });
});
