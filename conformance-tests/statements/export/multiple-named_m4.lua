-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/export/multiple-named_m4.js
local exports = {}
local a = 10
exports.a = a
local b = 8
local function foo()
	return b
end
exports.foo = foo
local function bar()
	return foo
end
return exports
