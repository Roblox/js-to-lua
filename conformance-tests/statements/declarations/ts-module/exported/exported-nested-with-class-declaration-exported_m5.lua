local exports = {}
local Foo = {}
local __Foo_BarClass__type
local __Foo_Bar_BazClass__type
do
	type BarClass = { property: string, method: (self: BarClass) -> BarClass }
	__Foo_BarClass__type = (nil :: any) :: BarClass
	type BarClass_statics = { new: () -> BarClass }
	local BarClass = {} :: BarClass & BarClass_statics;
	(BarClass :: any).__index = BarClass
	function BarClass.new(): BarClass
		local self = setmetatable({}, BarClass)
		return (self :: any) :: BarClass
	end
	function BarClass:method(): BarClass
		return self
	end
	Foo.BarClass = BarClass
	local Bar = {}
	local __Bar_BazClass__type
	do
		type BazClass = { bazProperty: string, bazMethod: (self: BazClass) -> BazClass }
		__Bar_BazClass__type = (nil :: any) :: BazClass
		type BazClass_statics = { new: () -> BazClass }
		local BazClass = {} :: BazClass & BazClass_statics;
		(BazClass :: any).__index = BazClass
		function BazClass.new(): BazClass
			local self = setmetatable({}, BazClass)
			return (self :: any) :: BazClass
		end
		function BazClass:bazMethod(): BazClass
			return self
		end
		Bar.BazClass = BazClass
	end
	Foo.Bar = Bar
	type Bar_BazClass = typeof(__Bar_BazClass__type)
	__Foo_Bar_BazClass__type = (nil :: any) :: Bar_BazClass
end
exports.Foo = Foo
export type Foo_BarClass = typeof(__Foo_BarClass__type)
export type Foo_Bar_BazClass = typeof(__Foo_Bar_BazClass__type)
return exports
