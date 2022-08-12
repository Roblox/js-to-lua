local Foo = {}
local __Foo_Bar__type
type Foo_Bar = typeof(__Foo_Bar__type)
do
	type Bar = { property: string, method: (self: Bar) -> Bar }
	__Foo_Bar__type = (nil :: any) :: Bar
	type Bar_statics = { new: () -> Bar }
	local Bar = {} :: Bar & Bar_statics;
	(Bar :: any).__index = Bar
	function Bar.new(): Bar
		local self = setmetatable({}, Bar)
		return (self :: any) :: Bar
	end
	function Bar:method(): Bar
		return self
	end
	Foo.Bar = Bar
end
