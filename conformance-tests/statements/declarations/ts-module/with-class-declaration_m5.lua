-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/ts-module/with-class-declaration_m5.ts
local Foo = {}
do
	type Bar = { property: string, method: (self: Bar) -> () }
	type Bar_statics = { new: () -> Bar }
	local Bar = {} :: Bar & Bar_statics;
	(Bar :: any).__index = Bar
	function Bar.new(): Bar
		local self = setmetatable({}, Bar)
		return (self :: any) :: Bar
	end
	function Bar:method(): () end
end
