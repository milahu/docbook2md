# docbook2md

## deprecated

:warning: deprecated in favor of https://github.com/milahu/unifiedjs-docbook

## usage

```
git clone --recurse-submodules https://github.com/milahu/docbook2md
cd docbook2md
# install the pnpm workspace
pnpm install
node docbook2md.js
```

this will convert `attrsets.xml` to `attrsets.md`

## use case

convert nixpkgs docs from docbook to markdown

https://github.com/NixOS/nixpkgs/issues/105243

input file

[nixpkgs/doc/functions/library/attrsets.xml](https://github.com/NixOS/nixpkgs/blob/7a79469a24a71c26cb61b53590cb09ad6192654f/doc/functions/library/attrsets.xml)
