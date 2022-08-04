local exports = {}
local Foo = {}
do
	type Bar = { bar: string }
end
exports.Foo = Foo
return exports
