[![npm](https://img.shields.io/npm/v/pobem.svg?style=flat-square)](https://www.npmjs.com/package/pobem)
[![travis](http://img.shields.io/travis/bem-contrib/pobem.svg?style=flat-square)](https://travis-ci.org/bem-contrib/pobem)
[![coverage](https://img.shields.io/codecov/c/github/bem-contrib/pobem.svg?style=flat-square)](https://codecov.io/github/bem-contrib/pobem)
[![Downloads](https://img.shields.io/npm/dt/pobem.svg?style=flat-square)](https://www.npmjs.com/package/pobem)

# Pobem - postcss plugin for BEM

BEM syntax for CSS problem? Use POBEM!

## Overview

### Using with postcss-nested or less/sass

```stylus
block(block).mod(mod val) { /* 1 */
    mod(mod2 val2) {  /* 2 */
        color: #444223;
    }

    elem(elem) {  /* 3 */
        width: 100px;

        mod(mod val) {  /* 4 */
            width: 40px;
        }
    }

    > h2 { /* 5 */
        opacity: .3;
    }
}
```
```css
1 -> .block_mod_val
2 -> .block_mod_val.block_mod2_val2
3 -> .block_mod_val .block__elem
4 -> .block_mod_val .block__elem_mod_val
5 -> .block_mod_val > h2
```

### Using with stylus

```stylus
block(block).mod(mod val)
    mod(mod2 val2)
        color: #444223

    elem(elem)
        width: 100px

    > h2
        opacity: .3
```

### Combined chain syntax

```stylus
block(block).elem(elem) {}
-> .block__elem {}
```

### Using pseudo elements

```stylus
block(block).elem(elem):after {}
-> .block__elem:after {}
```

### Quotes and delimiters between `mod` `val` is optional

`block(block).mod(mod val) === block('block').mod('mod', 'val') === block('block').mod('mod' -> 'val')`

## Usage

`pobem` is a [PostCSS](https://github.com/postcss/postcss) plugin.

### CLI

```sh
npm i -S postcss postcss-cli pobem
```

```sh
postcss --use pobem test.css -o test.css
```

### API

```sh
npm i -S postcss pobem
```

```js
import postcss from 'postcss';
import pobem from 'pobem';

console.log(
    postcss([ pobem ]).process('block(block) {}').css
);
// .block {}
```

### webpack

```sh
npm i -S postcss postcss-loader pobem
```

```js
import pobem from 'pobem';

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
        return [ pobem ];
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
