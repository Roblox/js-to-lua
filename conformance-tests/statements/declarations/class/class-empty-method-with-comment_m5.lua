type Foo = { bar: (self: Foo) -> any, baz: (self: Foo) -> any }
local Foo = {}
Foo.__index = Foo
function Foo.new(): Foo
	local self = setmetatable({}, Foo)
	return (self :: any) :: Foo
end
function Foo.barStatic()
	--[[ hello bar static ]]
end
function Foo.bazStatic()
	--[[ hello baz static ]]
end
function Foo:bar()
	--[[ hello bar ]]
end
function Foo:baz()
	--[[ hello baz ]]
end
