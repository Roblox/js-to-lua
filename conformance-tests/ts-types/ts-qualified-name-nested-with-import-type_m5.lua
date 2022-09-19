-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/ts-qualified-name-nested-with-import-type_m5.ts
local barModule = require(script.Parent.bar)
type Foo = barModule.Foo
type Foo_Bar_Baz = barModule.Foo_Bar_Baz
type QualifiedSimple = Foo_Bar_Baz
