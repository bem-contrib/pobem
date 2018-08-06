[![npm](https://img.shields.io/npm/v/pobem.svg?style=flat-square)](https://www.npmjs.com/package/pobem)
[![travis](http://img.shields.io/travis/bem-contrib/pobem.svg?style=flat-square)](https://travis-ci.org/bem-contrib/pobem)
[![coverage](https://img.shields.io/codecov/c/github/bem-contrib/pobem.svg?style=flat-square)](https://codecov.io/github/bem-contrib/pobem)
[![Downloads](https://img.shields.io/npm/dt/pobem.svg?style=flat-square)](https://www.npmjs.com/package/pobem)

# Pobem - postcss plugin for BEM

BEM syntax for CSS problem? Use POBEM!

## Overview

### In vanilla css

```css
// input
.block_mod_val:not(__text) __icon {}
// output
.block_mod_val:not(.block__text) .block__icon {}

// input
.block_mod_val._second-mod > h2 __icon {}
// output
.block_mod_val.block_second-mod > h2 .block__icon {}
```

### Using with postcss-nested or less/sass

```stylus

.block_mod_val { /* 1 */
    &._mod2_val2 {  /* 2 */
        color: #444223;
    }

    __elem {  /* 3 */
        width: 100px;

        &._mod_val {  /* 4 */
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
    postcss([ pobem ]).process('.block_mod_val __elem {}').css
);
// .block_mod_val .block__elem {}
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
