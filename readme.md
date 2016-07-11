[![npm](https://img.shields.io/npm/v/pobems.svg?style=flat-square)](https://www.npmjs.com/package/pobems)
[![travis](http://img.shields.io/travis/rebem/css.svg?style=flat-square)](https://travis-ci.org/belozyorcev/pobems)
[![coverage](https://img.shields.io/codecov/c/github/belozyorcev/pobems.svg?style=flat-square)](https://codecov.io/github/belozyorcev/pobems)
[![deps](https://img.shields.io/gemnasium/belozyorcev/pobems.svg?style=flat-square)](https://gemnasium.com/belozyorcev/pobems)

BEM syntax for CSS. Problems? Use POBEMS!

This is plugin based on rebem-css written by Kir Belevich and Denis Koltsov.

## Overview

### Dead simple

It just replaces substrings in selectors:

#### `:block()`

```css
:block(block) {}
.block {}
```

#### `:elem()`

```css
:block(block):elem(elem) {}
.block__elem {}

:block(block):elem(elem) :elem(elem2) :block(block2):elem(elem) {}
.block__elem .block__elem2 .block2__elem {}
```

#### `:mod()`

```css
:block(block):mod(mod) {}
.block_mod {}

:block(block):mod(mod val) {}
.block_mod_val {}

:block(block):mod(mod val):mod(mod2) {}
.block_mod_val.block_mod2 {}
```

```css
:block(block):elem(elem):mod(mod) {}
.block__elem_mod {}

:block(block):elem(elem):mod(mod val) {}
.block__elem_mod_val {}
```

### CSS compatible

It's just a custom pseudo-classes, so you can use it with Less or any other CSS preprocessor:

```less
:block(block) {
    &:mod(mod) {
        :elem(elem) {

        }
    }

    &:elem(elem) {
        &:mod(mod val) {

        }
    }
}
```

## Usage

`pobems` is a [PostCSS](https://github.com/postcss/postcss) plugin.

### CLI

```sh
npm i -S postcss postcss-cli pobems
```

```sh
postcss --use pobems test.css -o test.css
```

### API

```sh
npm i -S postcss pobems
```

```js
import postcss from 'postcss';
import pobems from 'pobems';

console.log(
    postcss([ pobems ]).process(':block(block) {}').css
);
// .block {}
```

### webpack

```sh
npm i -S postcss postcss-loader pobems
```

```js
import pobems from 'pobems';

export default {
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css!postcss'
            }
        ]
    },
    postcss() {
        return [ pobems ];
    }
};
```

### Custom delimeters

Default delimeters are `_` for modifiers and `__` for elements, but you can change it with special environment variables. For example in webpack you can do this with `DefinePlugin`:


```js
plugins: [
    new webpack.DefinePlugin({
        'process.env': {
            BEM_MOD_DELIM: JSON.stringify('--'),
            BEM_ELEM_DELIM: JSON.stringify('~~')
        }
    })
]
```
