local Foo = {}
do
	type Bar = { property: string, method: (self: Bar) -> () }
	local Bar = {}
	Bar.__index = Bar
	function Bar.new(): Bar
		local self = setmetatable({}, Bar)
		return (self :: any) :: Bar
	end
	function Bar:method(): () end
end
