local exports = {}
local Foo = {}
do
	local bar = { bar = "bar" }
	Foo.bar = bar
end
exports.Foo = Foo
return exports
