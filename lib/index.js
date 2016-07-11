import postcss from 'postcss';

const modDelim = process.env.BEM_MOD_DELIM || '_';
const elemDelim = process.env.BEM_ELEM_DELIM || '__';

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
                const groups = rawSelector.split(/\s+(?![\w'",]+\))/gi);

                const re = /:([\w-]+)(\((['",\w-\s]+)\))?/g;
                const ctx = { blockName: false, elemName: false, modName: false };

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
                    let lastIsBem = false;

                    while ((mathes = re.exec(group)) !== null) {
                        const tag = mathes[1];
                        const rawValue = mathes[2];
                        const value = rawValue ?
                          rawValue.replace(/(\)|\(|'|")/g, '').trim() : false;

                        lastIsBem = true;

                        if (tag === 'block') {
                            ctx.blockName = value;
                            continue;
                        }

                        if (tag === 'elem') {
                            ctx.elemName = value;
                            continue;
                        }

                        if (tag === 'mod') {
                            ctx.modName = value.replace(/(,\s?|\s+?)/g, modDelim);
                            selector += buildSelector(ctx);
                            continue;
                        }

                        lastIsBem = false;

                        // For pseudo-classes
                        selector += buildSelector(ctx);
                        selector += ':' + tag;
                        if (rawValue) {
                            selector += rawValue;
                        }

                    }
                    if (lastIsBem && !ctx.modName) {
                        selector += buildSelector(ctx);
                    }

                    result.push(selector);
                }

                return result.join(' ');
            });
    });
});
