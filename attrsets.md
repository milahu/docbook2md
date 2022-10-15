## Attribute-Set Functions

## <function>lib.attrset.attrByPath</function>

### Signature

```nix signature
attrByPath :: [String] -> Any -> AttrSet -> Any
```

Return an attribute from within nested attribute sets.

### Arguments

#### attrPath

A list of strings representing the path through the nested attribute set set.

#### default

Default value if attrPath does not resolve to an existing value.

#### set

The nested attributeset to select values from.

### Example: Extracting a value from a nested attribute set

```nix
let set = { a = { b = 3; }; };
in lib.attrsets.attrByPath [ "a" "b" ] 0 set
=> 3
```

### Example: No value at the path, instead using the default

```nix
lib.attrsets.attrByPath [ "a" "b" ] 0 {}
=> 0
```

## <function>lib.attrsets.hasAttrByPath</function>

### Signature

```nix signature
hasAttrByPath :: [String] -> AttrSet -> Bool
```

Determine if an attribute exists within a nested attribute set.

### Arguments

#### attrPath

A list of strings representing the path through the nested attribute set set.

#### set

The nested attributeset to check.

### Example: A nested value does exist inside a set

```nix
lib.attrsets.hasAttrByPath
  [ "a" "b" "c" "d" ]
  { a = { b = { c = { d = 123; }; }; }; }
=> true
```

## <function>lib.attrsets.setAttrByPath</function>

### Signature

```nix signature
setAttrByPath :: [String] -> Any -> AttrSet
```

Create a new attribute set with value set at the nested attribute location specified in attrPath.

### Arguments

#### attrPath

A list of strings representing the path through the nested attribute set.

#### value

The value to set at the location described by attrPath.

### Example: Creating a new nested attribute set

```nix
lib.attrsets.setAttrByPath [ "a" "b" ] 3
=> { a = { b = 3; }; }
```

## <function>lib.attrsets.getAttrFromPath</function>

### Signature

```nix signature
getAttrFromPath :: [String] -> AttrSet -> Value
```

Like except without a default, and it will throw if the value doesn't exist.

### Arguments

#### attrPath

A list of strings representing the path through the nested attribute set set.

#### set

The nested attribute set to find the value in.

### Example: Succesfully getting a value from an attribute set

```nix
lib.attrsets.getAttrFromPath [ "a" "b" ] { a = { b = 3; }; }
=> 3
```

### Example: Throwing after failing to get a value from an attribute set

```nix
lib.attrsets.getAttrFromPath [ "x" "y" ] { }
=> error: cannot find attribute `x.y'
```

## <function>lib.attrsets.attrVals</function>

### Signature

```nix signature
attrVals :: [String] -> AttrSet -> [Any]
```

Return the specified attributes from a set. All values must exist.

### Arguments

#### nameList

The list of attributes to fetch from set. Each attribute name must exist on the attrbitue set.

#### set

The set to get attribute values from.

### Example: Getting several values from an attribute set

```nix
lib.attrsets.attrVals [ "a" "b" "c" ] { a = 1; b = 2; c = 3; }
=> [ 1 2 3 ]
```

### Example: Getting missing values from an attribute set

```nix
lib.attrsets.attrVals [ "d" ] { }
error: attribute 'd' missing
```

## <function>lib.attrsets.attrValues</function>

### Signature

```nix signature
attrValues :: AttrSet -> [Any]
```

Get all the attribute values from an attribute set. Provides a backwards-compatible interface of builtins.attrValues for Nix version older than 1.8.

### Arguments

#### attrs

The attribute set.

### Example:

```nix
lib.attrsets.attrValues { a = 1; b = 2; c = 3; }
=> [ 1 2 3 ]
```

## <function>lib.attrsets.catAttrs</function>

### Signature

```nix signature
catAttrs :: String -> [AttrSet] -> [Any]
```

Collect each attribute named \`attr' from the list of attribute sets, sets. Sets that don't contain the named attribute are ignored. Provides a backwards-compatible interface of builtins.catAttrs for Nix version older than 1.9.

### Arguments

#### attr

Attribute name to select from each attribute set in sets.

#### sets

The list of attribute sets to select attr from.

### Example: Collect an attribute from a list of attribute sets.

```nix
catAttrs "a" [{a = 1;} {b = 0;} {a = 2;}]
=> [ 1 2 ]
```

## <function>lib.attrsets.filterAttrs</function>

### Signature

```nix signature
filterAttrs :: (String -> Any -> Bool) -> AttrSet -> AttrSet
```

Filter an attribute set by removing all attributes for which the given predicate return false.

### Arguments

#### pred

String -> Any -> Bool

Predicate which returns true to include an attribute, or returns false to exclude it.

name The attribute's name value The attribute's value

Returns true to include the attribute, false to exclude the attribute.

#### set

The attribute set to filter

### Example: Filtering an attributeset

```nix
filterAttrs (n: v: n == "foo") { foo = 1; bar = 2; }
=> { foo = 1; }
```

## <function>lib.attrsets.filterAttrsRecursive</function>

### Signature

```nix signature
filterAttrsRecursive :: (String -> Any -> Bool) -> AttrSet -> AttrSet
```

Filter an attribute set recursively by removing all attributes for which the given predicate return false.

### Arguments

#### pred

String -> Any -> Bool

Predicate which returns true to include an attribute, or returns false to exclude it.

name The attribute's name value The attribute's value

Returns true to include the attribute, false to exclude the attribute.

#### set

The attribute set to filter

### Example: Recursively filtering an attribute set

```nix
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
```

## <function>lib.attrsets.foldAttrs</function>

### Signature

```nix signature
foldAttrs :: (Any -> Any -> Any) -> Any -> [AttrSets] -> Any
```

Apply fold function to values grouped by key.

### Arguments

#### op

Any -> Any -> Any

Given a value val and a collector col, combine the two.

val An attribute's value col The result of previous op calls with other values and nul.

#### nul

The null-value, the starting value.

#### list_of_attrs

A list of attribute sets to fold together by key.

### Example: Combining an attribute of lists in to one attribute set

```nix
lib.attrsets.foldAttrs
  (n: a: [n] ++ a) []
  [
    { a = 2; b = 7; }
    { a = 3; }
    { b = 6; }
  ]
=> { a = [ 2 3 ]; b = [ 7 6 ]; }
```

## <function>lib.attrsets.collect</function>

### Signature

```nix signature
collect :: (Any -> Bool) -> AttrSet -> [Any]
```

Recursively collect sets that verify a given predicate named pred from the set attrs. The recursion stops when pred returns true.

### Arguments

#### pred

Any -> Bool

Given an attribute's value, determine if recursion should stop.

value The attribute set value.

#### attrs

The attribute set to recursively collect.

### Example: Collecting all lists from an attribute set

```nix
lib.attrsets.collect isList { a = { b = ["b"]; }; c = [1]; }
=> [["b"] [1]]
```

### Example: Collecting all attribute-sets which contain the <literal>outPath</literal> attribute name.

```nix
collect (x: x ? outPath)
  { a = { outPath = "a/"; }; b = { outPath = "b/"; }; }
=> [{ outPath = "a/"; } { outPath = "b/"; }]
```

## <function>lib.attrsets.nameValuePair</function>

### Signature

```nix signature
nameValuePair :: String -> Any -> AttrSet
```

Utility function that creates a {name, value} pair as expected by builtins.listToAttrs.

### Arguments

#### name

The attribute name.

#### value

The attribute value.

### Example: Creating a name value pair

```nix
nameValuePair "some" 6
=> { name = "some"; value = 6; }
```

## <function>lib.attrsets.mapAttrs</function>

### Signature

```nix signature

```

Apply a function to each element in an attribute set, creating a new attribute set. Provides a backwards-compatible interface of builtins.mapAttrs for Nix version older than 2.1.

### Arguments

#### fn

String -> Any -> Any

Given an attribute's name and value, return a new value.

name The name of the attribute. value The attribute's value.

### Example: Modifying each value of an attribute set

```nix
lib.attrsets.mapAttrs
  (name: value: name + "-" + value)
  { x = "foo"; y = "bar"; }
=> { x = "x-foo"; y = "y-bar"; }
```

## <function>lib.attrsets.mapAttrs'</function>

### Signature

```nix signature
mapAttrs' :: (String -> Any -> { name = String; value = Any }) -> AttrSet -> AttrSet
```

Like mapAttrs, but allows the name of each attribute to be changed in addition to the value. The applied function should return both the new name and value as a nameValuePair.

### Arguments

#### fn

String -> Any -> { name = String; value = Any }

Given an attribute's name and value, return a new name value pair.

name The name of the attribute. value The attribute's value.

#### set

The attribute set to map over.

### Example: Change the name and value of each attribute of an attribute set

```nix
lib.attrsets.mapAttrs' (name: value: lib.attrsets.nameValuePair ("foo_" + name) ("bar-" + value))
   { x = "a"; y = "b"; }
=> { foo_x = "bar-a"; foo_y = "bar-b"; }
```

## <function>lib.attrsets.mapAttrsToList</function>

### Signature

```nix signature
mapAttrsToList :: (String -> Any -> Any) -> AttrSet -> [Any]
```

Call fn for each attribute in the given set and return the result in a list.

### Arguments

#### fn

String -> Any -> Any

Given an attribute's name and value, return a new value.

name The name of the attribute. value The attribute's value.

#### set

The attribute set to map over.

### Example: Combine attribute values and names in to a list

```nix
lib.attrsets.mapAttrsToList (name: value: "${name}=${value}")
   { x = "a"; y = "b"; }
=> [ "x=a" "y=b" ]
```

## <function>lib.attrsets.mapAttrsRecursive</function>

### Signature

```nix signature
mapAttrsRecursive :: ([String] > Any -> Any) -> AttrSet -> AttrSet
```

Like mapAttrs, except that it recursively applies itself to attribute sets. Also, the first argument of the argument function is a list of the names of the containing attributes.

### Arguments

#### f

[ String ] -> Any -> Any

Given a list of attribute names and value, return a new value.

name_path The list of attribute names to this value. For example, the name_path for the example string in the attribute set { foo = { bar = "example"; }; } is [ "foo" "bar" ]. value The attribute's value.

#### set

The attribute set to recursively map over.

### Example: A contrived example of using <function>lib.attrsets.mapAttrsRecursive</function>

```nix
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
```

## <function>lib.attrsets.mapAttrsRecursiveCond</function>

### Signature

```nix signature
mapAttrsRecursiveCond :: (AttrSet -> Bool) -> ([ String ] -> Any -> Any) -> AttrSet -> AttrSet
```

Like mapAttrsRecursive, but it takes an additional predicate function that tells it whether to recursive into an attribute set. If it returns false, mapAttrsRecursiveCond does not recurse, but does apply the map function. It is returns true, it does recurse, and does not apply the map function.

### Arguments

#### cond

(AttrSet -> Bool)

Determine if mapAttrsRecursive should recurse deeper in to the attribute set.

attributeset An attribute set.

#### f

[ String ] -> Any -> Any

Given a list of attribute names and value, return a new value.

name_path The list of attribute names to this value. For example, the name_path for the example string in the attribute set { foo = { bar = "example"; }; } is [ "foo" "bar" ]. value The attribute's value.

#### set

The attribute set to recursively map over.

### Example: Only convert attribute values to JSON if the containing attribute set is marked for recursion

```nix
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
```

## <function>lib.attrsets.genAttrs</function>

### Signature

```nix signature
genAttrs :: [ String ] -> (String -> Any) -> AttrSet
```

Generate an attribute set by mapping a function over a list of attribute names.

### Arguments

#### names

Names of values in the resulting attribute set.

#### f

String -> Any

Takes the name of the attribute and return the attribute's value.

name The name of the attribute to generate a value for.

### Example: Generate an attrset based on names only

```nix
lib.attrsets.genAttrs [ "foo" "bar" ] (name: "x_${name}")
=> { foo = "x_foo"; bar = "x_bar"; }
```

## <function>lib.attrsets.isDerivation</function>

### Signature

```nix signature
isDerivation :: Any -> Bool
```

Check whether the argument is a derivation. Any set with `{ type = "derivation"; }` counts as a derivation.

### Arguments

#### value

The value which is possibly a derivation.

### Example: A package is a derivation

```nix
lib.attrsets.isDerivation (import <nixpkgs> {}).ruby
=> true
```

### Example: Anything else is not a derivation

```nix
lib.attrsets.isDerivation "foobar"
=> false
```

## <function>lib.attrsets.toDerivation</function>

### Signature

```nix signature
toDerivation :: Path -> Derivation
```

Converts a store path to a fake derivation.

### Arguments

#### path

A store path to convert to a derivation.

## <function>lib.attrsets.optionalAttrs</function>

### Signature

```nix signature
optionalAttrs :: Bool -> AttrSet
```

Conditionally return an attribute set or an empty attribute set.

### Arguments

#### cond

Condition under which the as attribute set is returned.

#### as

The attribute set to return if cond is true.

### Example: Return the provided attribute set when <varname>cond</varname> is true

```nix
lib.attrsets.optionalAttrs true { my = "set"; }
=> { my = "set"; }
```

### Example: Return an empty attribute set when <varname>cond</varname> is false

```nix
lib.attrsets.optionalAttrs false { my = "set"; }
=> { }
```

## <function>lib.attrsets.zipAttrsWithNames</function>

### Signature

```nix signature
zipAttrsWithNames :: [ String ] -> (String -> [ Any ] -> Any) -> [ AttrSet ] -> AttrSet
```

Merge sets of attributes and use the function f to merge attribute values where the attribute name is in names.

### Arguments

#### names

A list of attribute names to zip.

#### f

(String -> [ Any ] -> Any

Accepts an attribute name, all the values, and returns a combined value.

name The name of the attribute each value came from. vs A list of values collected from the list of attribute sets.

#### sets

A list of attribute sets to zip together.

### Example: Summing a list of attribute sets of numbers

```nix
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
```

## <function>lib.attrsets.zipAttrsWith</function>

### Signature

```nix signature
zipAttrsWith :: (String -> [ Any ] -> Any) -> [ AttrSet ] -> AttrSet
```

Merge sets of attributes and use the function f to merge attribute values. Similar to where all key names are passed for names.

### Arguments

#### f

(String -> [ Any ] -> Any

Accepts an attribute name, all the values, and returns a combined value.

name The name of the attribute each value came from. vs A list of values collected from the list of attribute sets.

#### sets

A list of attribute sets to zip together.

### Example: Summing a list of attribute sets of numbers

```nix
lib.attrsets.zipAttrsWith
  (name: vals: "${name} ${toString (builtins.foldl' (a: b: a + b) 0 vals)}")
  [
    { a = 1; b = 1; c = 1; }
    { a = 10; }
    { b = 100; }
    { c = 1000; }
  ]
=> { a = "a 11"; b = "b 101"; c = "c 1001"; }
```

## <function>lib.attrsets.zipAttrs</function>

### Signature

```nix signature
zipAttrs :: [ AttrSet ] -> AttrSet
```

Merge sets of attributes and combine each attribute value in to a list. Similar to where the merge function returns a list of all values.

### Arguments

#### sets

A list of attribute sets to zip together.

### Example: Combining a list of attribute sets

```nix
lib.attrsets.zipAttrs
  [
    { a = 1; b = 1; c = 1; }
    { a = 10; }
    { b = 100; }
    { c = 1000; }
  ]
=> { a = [ 1 10 ]; b = [ 1 100 ]; c = [ 1 1000 ]; }
```

## <function>lib.attrsets.recursiveUpdateUntil</function>

### Signature

```nix signature
recursiveUpdateUntil :: ( [ String ] -> AttrSet -> AttrSet -> Bool ) -> AttrSet -> AttrSet -> AttrSet
```

Does the same as the update operator // except that attributes are merged until the given predicate is verified. The predicate should accept 3 arguments which are the path to reach the attribute, a part of the first attribute set and a part of the second attribute set. When the predicate is verified, the value of the first attribute set is replaced by the value of the second attribute set.

### Arguments

#### pred

[ String ] -> AttrSet -> AttrSet -> Bool

path The path to the values in the left and right hand sides. l The left hand side value. r The right hand side value.

#### lhs

The left hand attribute set of the merge.

#### rhs

The right hand attribute set of the merge.

### Example: Recursively merging two attribute sets

```nix
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
```

## <function>lib.attrsets.recursiveUpdate</function>

### Signature

```nix signature
recursiveUpdate :: AttrSet -> AttrSet -> AttrSet
```

A recursive variant of the update operator //. The recursion stops when one of the attribute values is not an attribute set, in which case the right hand side value takes precedence over the left hand side value.

### Arguments

#### lhs

The left hand attribute set of the merge.

#### rhs

The right hand attribute set of the merge.

### Example: Recursively merging two attribute sets

```nix
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
```

## <function>lib.attrsets.recurseIntoAttrs</function>

### Signature

```nix signature
recurseIntoAttrs :: AttrSet -> AttrSet
```

Make various Nix tools consider the contents of the resulting attribute set when looking for what to build, find, etc. This function only affects a single attribute set; it does not apply itself recursively for nested attribute sets.

### Arguments

#### attrs

An attribute set to scan for derivations.

### Example: Making Nix look inside an attribute set

```nix
{ pkgs ? import <nixpkgs> {} }:
{
  myTools = pkgs.lib.recurseIntoAttrs {
    inherit (pkgs) hello figlet;
  };
}
```

## <function>lib.attrsets.cartesianProductOfSets</function>

### Signature

```nix signature
cartesianProductOfSets :: AttrSet -> [ AttrSet ]
```

Return the cartesian product of attribute set value combinations.

### Arguments

#### set

An attribute set with attributes that carry lists of values.

### Example: Creating the cartesian product of a list of attribute values

```nix
cartesianProductOfSets { a = [ 1 2 ]; b = [ 10 20 ]; }
=> [
     { a = 1; b = 10; }
     { a = 1; b = 20; }
     { a = 2; b = 10; }
     { a = 2; b = 20; }
   ]
```
