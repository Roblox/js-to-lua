-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/ts-module/exported/exported-with-type_m5.ts
local exports = {}
local Foo = {}
do
	type Bar = { bar: string }
end
exports.Foo = Foo
return exports
