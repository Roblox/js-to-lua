local exports = {}
local Foo = {}
do
	type Bar = Foo_Bar
end
exports.Foo = Foo
export type Foo_Bar = { bar: string }
return exports
