import postcss from 'postcss';

function buildSelector (ctx, mod) {
    let selector = '.';

    if (ctx.blockName) {
        selector += ctx.options.ns + ctx.blockName;
    }
    if (ctx.elemName) {
        selector += ctx.options.elem + ctx.elemName;
    }
    if (mod) {
        selector += ctx.options.modName + mod;

        return selector;
    }

    return selector;
}

export default postcss.plugin('pobem', (options) => {

    if (process.env.BEM_MOD_DELIM || process.env.BEM_ELEM_DELIM) {
        console.warn('BEM_MOD_DELIM and BEM_ELEM_DELIM is deprecated and will be removed in a future version.')
    }

    options = Object.assign({
        ns: '',
        elem: process.env.BEM_MOD_DELIM || '_',
        modName:  process.env.BEM_ELEM_DELIM || '__',
        modValue: '_'
    }, options || {})
    return css => {
        css.walkRules((rule) => {
            rule.selector = rule.selector
                .replace(/[.:]?(block\(.+)/g, (match, raw) => {
                    // "block(b1).elem(elem).mod(mod)" -> "block(b1) elem(elem) mod(mod)"
                    const rawSelector = raw
                        .replace(/[.:]?(block|elem|mod)(\([\s\w'"\->,]+\))/g, '=b=$1$2=b=')
                        .replace(/block(\([\s\w'"\->,]+\))=b=\s*=b=(elem|mod)/g, 'block$1=b=$2')
                        .replace(/elem(\([\s\w'"\->,]+\))=b=\s*=b=(mod)/g, 'elem$1=b=$2')
                        .replace(/mod(\([\s\w'"\->,]+\))=b=\s*=b=(mod)/g, 'mod$1=b=$2');

                    // "block(b) mod(m v) div block(b2)" -> ["block(b)", "mod(m v)", "div", "block(b2)"]
                    const groups = rawSelector.split('=b=');

                    const declBemRegex = /(block|elem|mod)\((['",\w->\s]+)\)/g;

                    // Convert all groups to CSS selectors
                    // block(b) mod(m v) -> .b_m_v

                    const ctx = { blockName: false, elemName: false, options: options };
                    let requiredBuild = false;
                    const result = [];

                    for (const group of groups) {
                        if (!group.match(declBemRegex)) {
                            requiredBuild ? result.push(buildSelector(ctx)) : '';
                            result.push(group);
                            continue;
                        }
                        const mathes = declBemRegex.exec(group);
                        const _tag = 1;
                        const _value = 2;
                        const tag = mathes[_tag];
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
                            const mod = value.replace(/(\s?->\s?|,\s?|\s+?)/g, options.modValue);

                            result.push(buildSelector(ctx, mod));
                            continue;
                        }
                        requiredBuild = false;
                    }

                    return result.join('');
                });
        });
    }
});
