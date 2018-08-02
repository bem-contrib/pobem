import postcss from 'postcss';
import assert from 'assert';
import requireUncached from 'require-uncached';

import Plugin from '../../lib/';

const test = (selector, result) => {
    assert.strictEqual(
        postcss([ Plugin ]).process(selector + '{}').css,
        result + '{}'
    );
};

describe('plugin', () => {
    describe('block', () => {
        it('simple', () => {
            test(
                '.block',
                '.block'
            );
        });

        it('multiple blocks', () => {
            test(
                '.block1 .block2',
                '.block1 .block2'
            );
        });

        it('mixed block', () => {
            test(
                '.block1.block2',
                '.block1.block2'
            );
        });

        it('selector with attrs', () => {
            test(
                '.menu[class*=\'menu_mode\']',
                '.menu[class*=\'menu_mode\']'
            );
        });

        it('with other tags', () => {
            test(
                '.block1 div .bl2 img',
                '.block1 div .bl2 img'
            );
        });
    });

    describe('elem', () => {
        it('simple', () => {
            test(
                '.block .__elem',
                '.block__elem'
            );
        });

        it('multiple blocks elems', () => {
            test(
                '.block1 .__elem1 .block2 .__elem)',
                '.block1__elem1 .block2__elem2'
            );
        });

        it('block multiple short elems', () => {
            test(
                '.block1 .__elem1 .__elem2 .__elem3',
                '.block1__elem1 .block1__elem2 .block1__elem3'
            );
        });
    });

    describe('mod', () => {
        describe('block', () => {
            it('block short mod', () => {
                test(
                    '.block_mod',
                    '.block_mod'
                );
            });

            it('block multiple short mods', () => {
                test(
                    '.block_mod._mod2',
                    '.block_mod.block_mod2'
                );
            });

            it('multiple blocks shorts mods', () => {
                test(
                    '.block1_mod1 .block2_mod2',
                    '.block1_mod1 .block2_mod2'
                );
            });

            it('multiple blocks mods with delimeter "-" in value', () => {
                test(
                    '.block_mod_val-1 .__icon',
                    '.block_mod_val-1 .block__icon'
                );
            });

            it('block mod', () => {
                test(
                    '.block_mod_val',
                    '.block_mod_val'
                );
            });

            it('multiple blocks mods', () => {
                test(
                    '.block1_mod1_val1 .block2_mod2_val2',
                    '.block1_mod1_val1 .block2_mod2_val2'
                );
            });
        });

        describe('elem', () => {
            it('elem short mod', () => {
                test(
                    '.block__elem_mod',
                    '.block__elem_mod'
                );
            });
            it('elem multiple short mods', () => {
                test(
                    '.block__elem_mod._mod2',
                    '.block__elem_mod.block__elem_mod2'
                );
            });

            it('multiple elems short mods', () => {
                test(
                    '.block1__elem1_mod1 .block2__elem2_mod2',
                    '.block1__elem1_mod1 .block2__elem2_mod2'
                );
            });

            it('elem mod', () => {
                test(
                    '.block__elem_mod_val',
                    '.block__elem_mod_val'
                );
            });
        });
    });

    // describe('custom delimeters', function() {
    //     it('mods', function() {
    //         process.env.BEM_MOD_DELIM = '~~';
    //
    //         const CustomPlugin = requireUncached('../../lib/');
    //
    //         assert.strictEqual(
    //             postcss([ CustomPlugin ]).process('block(block).mod(mod val){}').css,
    //             '.block~~mod~~val{}'
    //         );
    //     });
    //
    //     it('elem', function() {
    //         process.env.BEM_ELEM_DELIM = '--';
    //
    //         const CustomPlugin = requireUncached('../../lib/');
    //
    //         assert.strictEqual(
    //             postcss([ CustomPlugin ]).process('block(block).elem(elem){}').css,
    //             '.block--elem{}'
    //         );
    //     });
    // });
});
