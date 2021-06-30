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
