# Attribute-Set Functions {#sec-functions-library-attrset}

## `lib.attrset.attrByPath` {#function-library-lib.attrsets.attrByPath}

Return an attribute from within nested attribute sets.

`attrPath`

:   A list of strings representing the path through the nested attribute set `set`.

`default`

:   Default value if `attrPath` does not resolve to an existing value.

`set`

:   The nested attributeset to select values from.

```{=html}
<!-- -->
```
  let set = { a = { b = 3; }; };
  in lib.attrsets.attrByPath [ "a" "b" ] 0 set
  => 3

  lib.attrsets.attrByPath [ "a" "b" ] 0 {}
  => 0

## `lib.attrsets.hasAttrByPath` {#function-library-lib.attrsets.hasAttrByPath}

Determine if an attribute exists within a nested attribute set.

`attrPath`

:   A list of strings representing the path through the nested attribute set `set`.

`set`

:   The nested attributeset to check.

```{=html}
<!-- -->
```
  lib.attrsets.hasAttrByPath
    [ "a" "b" "c" "d" ]
    { a = { b = { c = { d = 123; }; }; }; }
  => true

## `lib.attrsets.setAttrByPath` {#function-library-lib.attrsets.setAttrByPath}

Create a new attribute set with `value` set at the nested attribute location specified in `attrPath`.

`attrPath`

:   A list of strings representing the path through the nested attribute set.

`value`

:   The value to set at the location described by `attrPath`.

```{=html}
<!-- -->
```
  lib.attrsets.setAttrByPath [ "a" "b" ] 3
  => { a = { b = 3; }; }

## `lib.attrsets.getAttrFromPath` {#function-library-lib.attrsets.getAttrFromPath}

Like [](#function-library-lib.attrsets.attrByPath) except without a default, and it will throw if the value doesn\'t exist.

`attrPath`

:   A list of strings representing the path through the nested attribute set `set`.

`set`

:   The nested attribute set to find the value in.

```{=html}
<!-- -->
```
  lib.attrsets.getAttrFromPath [ "a" "b" ] { a = { b = 3; }; }
  => 3

  lib.attrsets.getAttrFromPath [ "x" "y" ] { }
  => error: cannot find attribute `x.y'

## `lib.attrsets.attrVals` {#function-library-lib.attrsets.attrVals}

Return the specified attributes from a set. All values must exist.

`nameList`

:   The list of attributes to fetch from `set`. Each attribute name must exist on the attrbitue set.

`set`

:   The set to get attribute values from.

```{=html}
<!-- -->
```
  lib.attrsets.attrVals [ "a" "b" "c" ] { a = 1; b = 2; c = 3; }
  => [ 1 2 3 ]

  lib.attrsets.attrVals [ "d" ] { }
  error: attribute 'd' missing

## `lib.attrsets.attrValues` {#function-library-lib.attrsets.attrValues}

Get all the attribute values from an attribute set.

Provides a backwards-compatible interface of `builtins.attrValues` for Nix version older than 1.8.

`attrs`

:   The attribute set.

```{=html}
<!-- -->
```
  lib.attrsets.attrValues { a = 1; b = 2; c = 3; }
  => [ 1 2 3 ]

## `lib.attrsets.catAttrs` {#function-library-lib.attrsets.catAttrs}

Collect each attribute named \`attr\' from the list of attribute sets, `sets`. Sets that don\'t contain the named attribute are ignored.

Provides a backwards-compatible interface of `builtins.catAttrs` for Nix version older than 1.9.

`attr`

:   Attribute name to select from each attribute set in `sets`.

`sets`

:   The list of attribute sets to select `attr` from.

Attribute sets which don\'t have the attribute are ignored.

  catAttrs "a" [{a = 1;} {b = 0;} {a = 2;}]
  => [ 1 2 ]
        

## `lib.attrsets.filterAttrs` {#function-library-lib.attrsets.filterAttrs}

Filter an attribute set by removing all attributes for which the given predicate return false.

`pred`

:   `String -> Any -> Bool`

  Predicate which returns true to include an attribute, or returns false to exclude it.

  `name`

  :   The attribute\'s name

  `value`

  :   The attribute\'s value

  Returns `true` to include the attribute, `false` to exclude the attribute.

`set`

:   The attribute set to filter

```{=html}
<!-- -->
```
  filterAttrs (n: v: n == "foo") { foo = 1; bar = 2; }
  => { foo = 1; }

## `lib.attrsets.filterAttrsRecursive` {#function-library-lib.attrsets.filterAttrsRecursive}

Filter an attribute set recursively by removing all attributes for which the given predicate return false.

`pred`

:   `String -> Any -> Bool`

  Predicate which returns true to include an attribute, or returns false to exclude it.

  `name`

  :   The attribute\'s name

  `value`

  :   The attribute\'s value

  Returns `true` to include the attribute, `false` to exclude the attribute.

`set`

:   The attribute set to filter

```{=html}
<!-- -->
```
  lib.attrsets.filterAttrsRecursive
    (n: v: v != null)
    {
      levelA = {
        example = "hi";
        levelB = {
          hello = "there";
          this-one-is-present = {
            this-is-excluded = null;
          };
        };
        this-one-is-also-excluded = null;
      };
      also-excluded = null;
    }
  => {
       levelA = {
         example = "hi";
         levelB = {
           hello = "there";
           this-one-is-present = { };
         };
       };
     }
       

## `lib.attrsets.foldAttrs` {#function-library-lib.attrsets.foldAttrs}

Apply fold function to values grouped by key.

`op`

:   `Any -> Any -> Any`

  Given a value `val` and a collector `col`, combine the two.

  `val`

  :   An attribute\'s value

  `col`

  :   The result of previous `op` calls with other values and `nul`.

`nul`

:   The null-value, the starting value.

`list_of_attrs`

:   A list of attribute sets to fold together by key.

```{=html}
<!-- -->
```
  lib.attrsets.foldAttrs
    (n: a: [n] ++ a) []
    [
      { a = 2; b = 7; }
      { a = 3; }
      { b = 6; }
    ]
  => { a = [ 2 3 ]; b = [ 7 6 ]; }

## `lib.attrsets.collect` {#function-library-lib.attrsets.collect}

Recursively collect sets that verify a given predicate named `pred` from the set `attrs`. The recursion stops when `pred` returns `true`.

`pred`

:   `Any -> Bool`

  Given an attribute\'s value, determine if recursion should stop.

  `value`

  :   The attribute set value.

`attrs`

:   The attribute set to recursively collect.

```{=html}
<!-- -->
```
  lib.attrsets.collect isList { a = { b = ["b"]; }; c = [1]; }
  => [["b"] [1]]

  collect (x: x ? outPath)
    { a = { outPath = "a/"; }; b = { outPath = "b/"; }; }
  => [{ outPath = "a/"; } { outPath = "b/"; }]

## `lib.attrsets.nameValuePair` {#function-library-lib.attrsets.nameValuePair}

Utility function that creates a `{name, value}` pair as expected by `builtins.listToAttrs`.

`name`

:   The attribute name.

`value`

:   The attribute value.

```{=html}
<!-- -->
```
  nameValuePair "some" 6
  => { name = "some"; value = 6; }

## `lib.attrsets.mapAttrs` {#function-library-lib.attrsets.mapAttrs}

Apply a function to each element in an attribute set, creating a new attribute set.

Provides a backwards-compatible interface of `builtins.mapAttrs` for Nix version older than 2.1.

`fn`

:   `String -> Any -> Any`

  Given an attribute\'s name and value, return a new value.

  `name`

  :   The name of the attribute.

  `value`

  :   The attribute\'s value.

```{=html}
<!-- -->
```
  lib.attrsets.mapAttrs
    (name: value: name + "-" + value)
    { x = "foo"; y = "bar"; }
  => { x = "x-foo"; y = "y-bar"; }

## `lib.attrsets.mapAttrs'` {#function-library-lib.attrsets.mapAttrs-prime}

Like `mapAttrs`, but allows the name of each attribute to be changed in addition to the value. The applied function should return both the new name and value as a `nameValuePair`.

`fn`

:   `String -> Any -> { name = String; value = Any }`

  Given an attribute\'s name and value, return a new [name value pair](#function-library-lib.attrsets.nameValuePair).

  `name`

  :   The name of the attribute.

  `value`

  :   The attribute\'s value.

`set`

:   The attribute set to map over.

```{=html}
<!-- -->
```
  lib.attrsets.mapAttrs' (name: value: lib.attrsets.nameValuePair ("foo_" + name) ("bar-" + value))
     { x = "a"; y = "b"; }
  => { foo_x = "bar-a"; foo_y = "bar-b"; }

      

## `lib.attrsets.mapAttrsToList` {#function-library-lib.attrsets.mapAttrsToList}

Call `fn` for each attribute in the given `set` and return the result in a list.

`fn`

:   `String -> Any -> Any`

  Given an attribute\'s name and value, return a new value.

  `name`

  :   The name of the attribute.

  `value`

  :   The attribute\'s value.

`set`

:   The attribute set to map over.

```{=html}
<!-- -->
```
  lib.attrsets.mapAttrsToList (name: value: "${name}=${value}")
     { x = "a"; y = "b"; }
  => [ "x=a" "y=b" ]

## `lib.attrsets.mapAttrsRecursive` {#function-library-lib.attrsets.mapAttrsRecursive}

Like `mapAttrs`, except that it recursively applies itself to attribute sets. Also, the first argument of the argument function is a *list* of the names of the containing attributes.

`f`

:   `[ String ] -> Any -> Any`

  Given a list of attribute names and value, return a new value.

  `name_path`

  :   The list of attribute names to this value.

    For example, the `name_path` for the `example` string in the attribute set `{ foo = { bar = "example"; }; }` is `[ "foo" "bar" ]`.

  `value`

  :   The attribute\'s value.

`set`

:   The attribute set to recursively map over.

```{=html}
<!-- -->
```
  mapAttrsRecursive
    (path: value: concatStringsSep "-" (path ++ [value]))
    {
      n = {
        a = "A";
        m = {
          b = "B";
          c = "C";
        };
      };
      d = "D";
    }
  => {
       n = {
         a = "n-a-A";
         m = {
           b = "n-m-b-B";
           c = "n-m-c-C";
         };
       };
       d = "d-D";
     }
      

## `lib.attrsets.mapAttrsRecursiveCond` {#function-library-lib.attrsets.mapAttrsRecursiveCond}

Like `mapAttrsRecursive`, but it takes an additional predicate function that tells it whether to recursive into an attribute set. If it returns false, `mapAttrsRecursiveCond` does not recurse, but does apply the map function. It is returns true, it does recurse, and does not apply the map function.

`cond`

:   `(AttrSet -> Bool)`

  Determine if `mapAttrsRecursive` should recurse deeper in to the attribute set.

  `attributeset`

  :   An attribute set.

`f`

:   `[ String ] -> Any -> Any`

  Given a list of attribute names and value, return a new value.

  `name_path`

  :   The list of attribute names to this value.

    For example, the `name_path` for the `example` string in the attribute set `{ foo = { bar = "example"; }; }` is `[ "foo" "bar" ]`.

  `value`

  :   The attribute\'s value.

`set`

:   The attribute set to recursively map over.

```{=html}
<!-- -->
```
  lib.attrsets.mapAttrsRecursiveCond
    ({ recurse ? false, ... }: recurse)
    (name: value: builtins.toJSON value)
    {
      dorecur = {
        recurse = true;
        hello = "there";
      };
      dontrecur = {
        converted-to- = "json";
      };
    }
  => {
       dorecur = {
         hello = "\"there\"";
         recurse = "true";
       };
       dontrecur = "{\"converted-to\":\"json\"}";
     }
      

## `lib.attrsets.genAttrs` {#function-library-lib.attrsets.genAttrs}

Generate an attribute set by mapping a function over a list of attribute names.

`names`

:   Names of values in the resulting attribute set.

`f`

:   `String -> Any`

  Takes the name of the attribute and return the attribute\'s value.

  `name`

  :   The name of the attribute to generate a value for.

```{=html}
<!-- -->
```
  lib.attrsets.genAttrs [ "foo" "bar" ] (name: "x_${name}")
  => { foo = "x_foo"; bar = "x_bar"; }
       

## `lib.attrsets.isDerivation` {#function-library-lib.attrsets.isDerivation}

Check whether the argument is a derivation. Any set with `{ type = "derivation"; }` counts as a derivation.

`value`

:   The value which is possibly a derivation.

```{=html}
<!-- -->
```
  lib.attrsets.isDerivation (import <nixpkgs> {}).ruby
  => true
       

  lib.attrsets.isDerivation "foobar"
  => false
       

## `lib.attrsets.toDerivation` {#function-library-lib.attrsets.toDerivation}

Converts a store path to a fake derivation.

`path`

:   A store path to convert to a derivation.

## `lib.attrsets.optionalAttrs` {#function-library-lib.attrsets.optionalAttrs}

Conditionally return an attribute set or an empty attribute set.

`cond`

:   Condition under which the `as` attribute set is returned.

`as`

:   The attribute set to return if `cond` is true.

```{=html}
<!-- -->
```
  lib.attrsets.optionalAttrs true { my = "set"; }
  => { my = "set"; }
       

  lib.attrsets.optionalAttrs false { my = "set"; }
  => { }
       

## `lib.attrsets.zipAttrsWithNames` {#function-library-lib.attrsets.zipAttrsWithNames}

Merge sets of attributes and use the function `f` to merge attribute values where the attribute name is in `names`.

`names`

:   A list of attribute names to zip.

`f`

:   `(String -> [ Any ] -> Any`

  Accepts an attribute name, all the values, and returns a combined value.

  `name`

  :   The name of the attribute each value came from.

  `vs`

  :   A list of values collected from the list of attribute sets.

`sets`

:   A list of attribute sets to zip together.

```{=html}
<!-- -->
```
  lib.attrsets.zipAttrsWithNames
    [ "a" "b" ]
    (name: vals: "${name} ${toString (builtins.foldl' (a: b: a + b) 0 vals)}")
    [
      { a = 1; b = 1; c = 1; }
      { a = 10; }
      { b = 100; }
      { c = 1000; }
    ]
  => { a = "a 11"; b = "b 101"; }
       

## `lib.attrsets.zipAttrsWith` {#function-library-lib.attrsets.zipAttrsWith}

Merge sets of attributes and use the function `f` to merge attribute values. Similar to [](#function-library-lib.attrsets.zipAttrsWithNames) where all key names are passed for `names`.

`f`

:   `(String -> [ Any ] -> Any`

  Accepts an attribute name, all the values, and returns a combined value.

  `name`

  :   The name of the attribute each value came from.

  `vs`

  :   A list of values collected from the list of attribute sets.

`sets`

:   A list of attribute sets to zip together.

```{=html}
<!-- -->
```
  lib.attrsets.zipAttrsWith
    (name: vals: "${name} ${toString (builtins.foldl' (a: b: a + b) 0 vals)}")
    [
      { a = 1; b = 1; c = 1; }
      { a = 10; }
      { b = 100; }
      { c = 1000; }
    ]
  => { a = "a 11"; b = "b 101"; c = "c 1001"; }
       

## `lib.attrsets.zipAttrs` {#function-library-lib.attrsets.zipAttrs}

Merge sets of attributes and combine each attribute value in to a list. Similar to [](#function-library-lib.attrsets.zipAttrsWith) where the merge function returns a list of all values.

`sets`

:   A list of attribute sets to zip together.

```{=html}
<!-- -->
```
  lib.attrsets.zipAttrs
    [
      { a = 1; b = 1; c = 1; }
      { a = 10; }
      { b = 100; }
      { c = 1000; }
    ]
  => { a = [ 1 10 ]; b = [ 1 100 ]; c = [ 1 1000 ]; }
       

## `lib.attrsets.recursiveUpdateUntil` {#function-library-lib.attrsets.recursiveUpdateUntil}

Does the same as the update operator `//` except that attributes are merged until the given predicate is verified. The predicate should accept 3 arguments which are the path to reach the attribute, a part of the first attribute set and a part of the second attribute set. When the predicate is verified, the value of the first attribute set is replaced by the value of the second attribute set.

`pred`

:   `[ String ] -> AttrSet -> AttrSet -> Bool`

  `path`

  :   The path to the values in the left and right hand sides.

  `l`

  :   The left hand side value.

  `r`

  :   The right hand side value.

`lhs`

:   The left hand attribute set of the merge.

`rhs`

:   The right hand attribute set of the merge.

```{=html}
<!-- -->
```
  lib.attrsets.recursiveUpdateUntil (path: l: r: path == ["foo"])
    {
      # first attribute set
      foo.bar = 1;
      foo.baz = 2;
      bar = 3;
    }
    {
      #second attribute set
      foo.bar = 1;
      foo.quz = 2;
      baz = 4;
    }
  => {
    foo.bar = 1; # 'foo.*' from the second set
    foo.quz = 2; #
    bar = 3;     # 'bar' from the first set
    baz = 4;     # 'baz' from the second set
  }
       

## `lib.attrsets.recursiveUpdate` {#function-library-lib.attrsets.recursiveUpdate}

A recursive variant of the update operator `//`. The recursion stops when one of the attribute values is not an attribute set, in which case the right hand side value takes precedence over the left hand side value.

`lhs`

:   The left hand attribute set of the merge.

`rhs`

:   The right hand attribute set of the merge.

```{=html}
<!-- -->
```
  recursiveUpdate
    {
      boot.loader.grub.enable = true;
      boot.loader.grub.device = "/dev/hda";
    }
    {
      boot.loader.grub.device = "";
    }
  => {
    boot.loader.grub.enable = true;
    boot.loader.grub.device = "";
  }

## `lib.attrsets.recurseIntoAttrs` {#function-library-lib.attrsets.recurseIntoAttrs}

Make various Nix tools consider the contents of the resulting attribute set when looking for what to build, find, etc.

This function only affects a single attribute set; it does not apply itself recursively for nested attribute sets.

`attrs`

:   An attribute set to scan for derivations.

```{=html}
<!-- -->
```
  { pkgs ? import <nixpkgs> {} }:
  {
    myTools = pkgs.lib.recurseIntoAttrs {
      inherit (pkgs) hello figlet;
    };
  }

## `lib.attrsets.cartesianProductOfSets` {#function-library-lib.attrsets.cartesianProductOfSets}

Return the cartesian product of attribute set value combinations.

`set`

:   An attribute set with attributes that carry lists of values.

```{=html}
<!-- -->
```
  cartesianProductOfSets { a = [ 1 2 ]; b = [ 10 20 ]; }
  => [
       { a = 1; b = 10; }
       { a = 1; b = 20; }
       { a = 2; b = 10; }
       { a = 2; b = 20; }
     ]
