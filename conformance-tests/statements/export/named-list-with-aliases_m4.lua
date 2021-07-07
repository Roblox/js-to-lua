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
