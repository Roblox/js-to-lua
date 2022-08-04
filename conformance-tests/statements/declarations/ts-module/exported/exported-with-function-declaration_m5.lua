local exports = {}
local Foo1 = {}
do
	local function bar() end
end
exports.Foo1 = Foo1
local Foo2 = {}
do
	local function bar() end
end
exports.Foo2 = Foo2
local Foo3 = {}
do
	local function bar() end
end
exports.Foo3 = Foo3
return exports
