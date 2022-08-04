local exports = {}
local Foo = {}
local __Foo_Bar_BazType__type
do
	type BarType = Foo_BarType
	local Bar = {}
	do
		type BazType = Bar_BazType
		local function baz(): BazType
			return { baz = 1 }
		end
	end
	Foo.Bar = Bar
	type Bar_BazType = { baz: number }
	__Foo_Bar_BazType__type = (nil :: any) :: Bar_BazType
end
exports.Foo = Foo
export type Foo_BarType = { bar: string }
export type Foo_Bar_BazType = typeof(__Foo_Bar_BazType__type)
return exports
