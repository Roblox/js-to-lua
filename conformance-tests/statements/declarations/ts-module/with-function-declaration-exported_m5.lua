-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/ts-module/with-function-declaration-exported_m5.ts
local Foo1 = {}
do
	local function bar() end
	Foo1.bar = bar
end
local Foo2 = {}
do
	local function bar() end
	Foo2.bar = bar
end
local Foo3 = {}
do
	local function bar() end
	Foo3.bar = bar
end
