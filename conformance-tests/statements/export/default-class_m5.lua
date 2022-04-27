local exports = {}
export type Foo = { prop: string }
local Foo = {}
Foo.__index = Foo
function Foo.new(): Foo
	local self = setmetatable({}, Foo)
	return (self :: any) :: Foo
end
exports.default = Foo
return exports
