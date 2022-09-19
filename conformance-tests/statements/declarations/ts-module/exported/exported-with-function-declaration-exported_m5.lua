-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/ts-module/exported/exported-with-function-declaration-exported_m5.ts
local exports = {}
local Foo1 = {}
do
	local function bar() end
	Foo1.bar = bar
end
exports.Foo1 = Foo1
local Foo2 = {}
do
	local function bar() end
	Foo2.bar = bar
end
exports.Foo2 = Foo2
local Foo3 = {}
do
	local function bar() end
	Foo3.bar = bar
end
exports.Foo3 = Foo3
return exports
