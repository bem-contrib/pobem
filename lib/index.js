import postcss from 'postcss';

const modDelim = process.env.BEM_MOD_DELIM || '_';
const elemDelim = process.env.BEM_ELEM_DELIM || '__';

function buildSelector (ctx, mod) {
    let selector = '.';

    if (ctx.blockName) {
        selector += ctx.blockName;
    }
    if (ctx.elemName) {
        selector += elemDelim + ctx.elemName;
    }
    if (mod) {
        selector += modDelim + mod;
    }

    return selector;
}

export default postcss.plugin('pobems', () => (css) => {
    css.walkRules((rule) => {
        rule.selector = rule.selector
            .replace(/(:block\(.+)/g, (match, rawSelector) => {

                // ":block(b):mod(m v) div :block(b2)" -> [":block(b):mod(m v)", "div", "block(b2)"]
                const groups = rawSelector.split(/\s+(?![\w\s->'",]+\))/gi);

                const re = /(:+)([\w-]+)(\((['",\w->\s]+)\))?/g;
                const ctx = { blockName: false, elemName: false };

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
                    let requiredBuild = false;

                    while ((mathes = re.exec(group)) !== null) {
                        const _spliter = 1;
                        const _tag = 2;
                        const _rawValue = 3;
                        const _value = 4;
                        const spliter = mathes[_spliter];
                        const tag = mathes[_tag];
                        const rawValue = mathes[_rawValue];
                        const value = mathes[_value] ?
                          mathes[_value].replace(/([\(\)'"])/g, '').trim() : false;


                        if (tag === 'block') {
                            requiredBuild = true;
                            ctx.elemName = false;
                            ctx.blockName = value;
                            continue;
                        }

                        if (tag === 'elem') {
                            requiredBuild = true;
                            ctx.elemName = value;
                            continue;
                        }

                        if (tag === 'mod') {
                            requiredBuild = false;
                            const mod = value.replace(/(\s?->\s?|,\s?|\s+?)/g, modDelim);

                            selector += buildSelector(ctx, mod);
                            continue;
                        }

                        // For pseudo-classes
                        selector += requiredBuild ? buildSelector(ctx) : '';
                        selector += spliter + tag;
                        if (rawValue) {
                            selector += rawValue;
                        }

                        requiredBuild = false;
                    }
                    if (requiredBuild) {
                        selector += buildSelector(ctx);
                    }

                    result.push(selector);
                }

                return result.join(' ');
            });
    });
});
