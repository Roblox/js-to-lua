type BaseClass<T> = {}
local BaseClass = {}
BaseClass.__index = BaseClass
function BaseClass.new<T>(): BaseClass<T>
	local self = setmetatable({}, BaseClass)
	return (self :: any) :: BaseClass<T>
end
type MyClass<V, W> = BaseClass<V> & {}
local MyClass = setmetatable({}, { __index = BaseClass })
MyClass.__index = MyClass
function MyClass.new<V, W>(): MyClass<V, W>
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	return (self :: any) :: MyClass<V, W>
end
type MyClassWithDefault<V = number, W = string> = BaseClass<V> & {}
local MyClassWithDefault = setmetatable({}, { __index = BaseClass })
MyClassWithDefault.__index = MyClassWithDefault
function MyClassWithDefault.new<V = number, W = string>(): MyClassWithDefault<V, W>
	local self = setmetatable({}, MyClassWithDefault) --[[ ROBLOX TODO: super constructor may be used ]]
	return (self :: any) :: MyClassWithDefault<V, W>
end
