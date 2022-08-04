local exports = {}
local Foo = {}
local __Foo_BarClass__type
local __Foo_Bar_BazClass__type
do
	type BarClass = { property: string, method: (self: BarClass) -> BarClass }
	__Foo_BarClass__type = (nil :: any) :: BarClass
	local BarClass = {}
	BarClass.__index = BarClass
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
		local BazClass = {}
		BazClass.__index = BazClass
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
