-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/flow-types/qualified-name-simple-with-import-type_m6.ts
local barModule = require(script.Parent.bar)
type Foo = barModule.Foo
type Foo_Bar = barModule.Foo_Bar
type QualifiedSimple = Foo_Bar
