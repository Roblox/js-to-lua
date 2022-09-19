-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/ts-module/exported/exported-with-type-exported_m5.ts
local exports = {}
local Foo = {}
do
	type Bar = Foo_Bar
end
exports.Foo = Foo
export type Foo_Bar = { bar: string }
return exports
