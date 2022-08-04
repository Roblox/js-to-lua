local exports = {}
local Foo = {}
local __Foo_Bar__type
do
	type Bar = { property: string, method: (self: Bar) -> Bar }
	__Foo_Bar__type = (nil :: any) :: Bar
	local Bar = {}
	Bar.__index = Bar
	function Bar.new(): Bar
		local self = setmetatable({}, Bar)
		return (self :: any) :: Bar
	end
	function Bar:method(): Bar
		return self
	end
	Foo.Bar = Bar
end
exports.Foo = Foo
export type Foo_Bar = typeof(__Foo_Bar__type)
return exports
