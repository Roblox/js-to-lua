-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/declaration-with-ts-qualified-name_m5.ts
local barModule = require(script.Parent.bar)
type Foo = barModule.Foo
type Foo_Bar = barModule.Foo_Bar
local a: Foo_Bar = "foo"
