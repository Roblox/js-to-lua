-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/ts-module/with-type-exported_m5.ts
local Foo = {}
type Foo_Bar = { bar: string }
do
	type Bar = Foo_Bar
end
