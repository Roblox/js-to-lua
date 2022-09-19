-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/ts-module/exported/exported-with-variable-declaration_m5.ts
local exports = {}
local Foo = {}
do
	local bar = { bar = "bar" }
end
exports.Foo = Foo
return exports
