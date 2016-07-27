# Bem-xjst

pobem позволяет писать кавычки (они не обязательны) для значений деклараций. А также в качестве разделителя между `mod` `val` использовать пробел, запятую, или стрелку `->`.
Перед декларацией может быть `.` для удобства восприятия по аналогии с JS, но она также не обязательна.

```sass
block('block').elem('elem').mod('mod', 'val') {}
block('block').elem('elem').mod('mod', 'val').block('mixed-block') {}
block('block').elem('elem').mod('mod', val).mod('mod2').block('mixed-block') {}
block('block').elem('elem').mod('mod', val).mod('mod2') .block('child-block') {}
```
Результат
```css
.block__elem_mod_val {}
.block__elem_mod_val.mixed-block {}
.block__elem_mod_val.block__elem_mod2.mixed-block {}
.block__elem_mod_val.block__elem_mod2 .child-block {}
```
