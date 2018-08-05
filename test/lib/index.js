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
                '.block__elem',
                '.block__elem'
            );
        });

        it('child elem', () => {
            test(
                '.block1__elem1 __elem2',
                '.block1__elem1 .block1__elem2'
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

            it('block mod with val', () => {
                test(
                    '.block._mod_val',
                    '.block.block_mod_val'
                );
            });
        });

        describe('elem', () => {
            it('elem short mod', () => {
                test(
                    '.block__elem._mod',
                    '.block__elem.block__elem_mod'
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
