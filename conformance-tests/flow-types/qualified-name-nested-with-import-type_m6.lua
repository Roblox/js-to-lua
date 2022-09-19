-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/qualified-name-nested-with-import-type_m6.ts
local barModule = require(script.Parent.bar)
type Foo = barModule.Foo
type Foo_Bar_Baz = barModule.Foo_Bar_Baz
type QualifiedSimple = Foo_Bar_Baz
