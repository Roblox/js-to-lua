-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/ts-types/as/cast-with-ts-qualified-name_m5.ts
local barModule = require(script.Parent.bar)
type Foo = barModule.Foo
type Foo_Bar = barModule.Foo_Bar
local a = "foo" :: Foo_Bar
