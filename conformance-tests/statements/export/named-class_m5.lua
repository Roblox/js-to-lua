local exports = {}
export type Foo = { prop: string }
type Foo_statics = { new: () -> Foo }
local Foo = {} :: Foo & Foo_statics;
(Foo :: any).__index = Foo
function Foo.new(): Foo
	local self = setmetatable({}, Foo)
	return (self :: any) :: Foo
end
exports.Foo = Foo
return exports
