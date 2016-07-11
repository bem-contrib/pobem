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
                ':block(block)',
                '.block'
            );
        });

        it('multiple blocks', () => {
            test(
                ':block(block1) :block(block2)',
                '.block1 .block2'
            );
        });

        it('with other tags', () => {
            test(
                ':block(block1) div :block(bl2) img',
                '.block1 div .bl2 img'
            );
        });
    });

    describe('elem', () => {
        it('simple', () => {
            test(
                ':block(block):elem(elem)',
                '.block__elem'
            );
        });

        it('multiple blocks elems', () => {
            test(
                ':block(block1):elem(elem1) :block(block2):elem(elem2)',
                '.block1__elem1 .block2__elem2'
            );
        });

        it('block multiple short elems', () => {
            test(
                ':block(block1):elem(elem1) :elem(elem2) :elem(elem3)',
                '.block1__elem1 .block1__elem2 .block1__elem3'
            );
        });
    });

    describe('mod', () => {
        describe('block', () => {
            it('block short mod', () => {
                test(
                    ':block(block):mod(mod)',
                    '.block_mod'
                );
            });

            it('block multiple short mods', () => {
                test(
                    ':block(block):mod(mod):mod(mod2)',
                    '.block_mod.block_mod2'
                );
            });

            it('multiple blocks shorts mods', () => {
                test(
                    ':block(block1):mod(mod1) :block(block2):mod(mod2)',
                    '.block1_mod1 .block2_mod2'
                );
            });

            it('block mod', () => {
                test(
                    ':block(block):mod(mod val)',
                    '.block_mod_val'
                );
            });

            it('multiple blocks mods', () => {
                test(
                    ':block(block1):mod(mod1 val1) :block(block2):mod(mod2 val2)',
                    '.block1_mod1_val1 .block2_mod2_val2'
                );
            });
        });

        describe('elem', () => {
            it('elem short mod', () => {
                test(
                    ':block(block):elem(elem):mod(mod)',
                    '.block__elem_mod'
                );
            });
            it('elem multiple short mods', () => {
                test(
                    ':block(block):elem(elem):mod(mod):mod(mod2)',
                    '.block__elem_mod.block__elem_mod2'
                );
            });

            it('multiple elems short mods', () => {
                test(
                    ':block(block1):elem(elem1):mod(mod1) :block(block2):elem(elem2):mod(mod2)',
                    '.block1__elem1_mod1 .block2__elem2_mod2'
                );
            });

            it('elem mod', () => {
                test(
                    ':block(block):elem(elem):mod(mod val)',
                    '.block__elem_mod_val'
                );
            });

            it('multiple elems mods', () => {
                test(
                    ':block(block1):elem(elem1):mod(mod1 val1) :block(block2):elem(elem2):mod(mod2 val2)',
                    '.block1__elem1_mod1_val1 .block2__elem2_mod2_val2'
                );
            });
        });
    });

    describe('custom delimeters', function() {
        it('mods', function() {
            process.env.REBEM_MOD_DELIM = '~~';

            const CustomPlugin = requireUncached('../../lib/');

            assert.strictEqual(
                postcss([ CustomPlugin ]).process(':block(block):mod(mod val){}').css,
                '.block~~mod~~val{}'
            );
        });

        it('elem', function() {
            process.env.REBEM_ELEM_DELIM = '--';

            const CustomPlugin = requireUncached('../../lib/');

            assert.strictEqual(
                postcss([ CustomPlugin ]).process(':block(block):elem(elem){}').css,
                '.block--elem{}'
            );
        });
    });
});
