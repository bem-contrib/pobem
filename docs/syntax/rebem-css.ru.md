# Rebem-css

Стандартная версия Rebem-css
```sass
:block(block):elem(elem):mod(mod val) {}
:block(block):elem(elem):mod(mod val):block(mixed-block) {}
:block(block):elem(elem):mod(mod val):block(block):elem(elem):mod(mod2):block(mixed-block) {}
:block(block):elem(elem):mod(mod val):block(block):elem(elem):mod(mod2):block(mixed-block) {}
```

Короткая версия Rebem-css, если использовать контекст pobem
```sass
:block(block):elem(elem):mod(mod val) {}
:block(block):elem(elem):mod(mod val):block(mixed-block) {}
:block(block):elem(elem):mod(mod val):mod(mod2):block(mixed-block) {}
```
Результат
```css
.block__elem_mod_val {}
.block__elem_mod_val.mixed-block {}
.block__elem_mod_val.block__elem_mod2.mixed-block {}
```
