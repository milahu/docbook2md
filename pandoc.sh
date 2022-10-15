#!/bin/sh

o=attrsets.pandoc.md

pandoc -f docbook -t markdown --tab-stop=2 --wrap=none attrsets.xml -o $o

echo writing $o
