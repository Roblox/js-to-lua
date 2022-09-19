-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/export/named-list-with-aliases_m4.js
local exports = {}
local a = 10
local b = 8
local function foo()
	return b
end
local function bar()
	return foo
end
exports.a = a
exports.b = b
exports.c = foo
exports.d = bar
return exports
