local exports = {}
local Foo = {}
do
	local bar = { bar = "bar" }
end
exports.Foo = Foo
return exports
