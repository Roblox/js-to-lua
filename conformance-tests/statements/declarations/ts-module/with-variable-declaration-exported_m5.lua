-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/ts-module/with-variable-declaration-exported_m5.ts
local Foo = {}
do
	local bar = { bar = "bar" }
	Foo.bar = bar
end
