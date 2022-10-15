# docbook2md

## usage

```
cd nixpkgs
cd doc
git clone https://github.com/milahu/docbook2md
(
  cd docbook2md
  npm install
)
node docbook2md/docbook2md.js
```

this will produce `functions/library/attrsets.md`

## use case

convert nixpkgs docs from docbook to markdown

https://github.com/NixOS/nixpkgs/issues/105243

input file

[nixpkgs/doc/functions/library/attrsets.xml](https://github.com/NixOS/nixpkgs/blob/7a79469a24a71c26cb61b53590cb09ad6192654f/doc/functions/library/attrsets.xml)
