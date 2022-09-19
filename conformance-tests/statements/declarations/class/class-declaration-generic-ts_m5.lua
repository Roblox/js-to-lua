-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/class/class-declaration-generic-ts_m5.ts
type BaseClass<T> = {}
type BaseClass_statics = { new: <T>() -> BaseClass<T> }
local BaseClass = {} :: BaseClass<any> & BaseClass_statics;
(BaseClass :: any).__index = BaseClass
function BaseClass.new<T>(): BaseClass<T>
	local self = setmetatable({}, BaseClass)
	return (self :: any) :: BaseClass<T>
end
type MyClass<V, W> = BaseClass<V> & {}
type MyClass_statics = { new: <V, W>() -> MyClass<V, W> }
local MyClass = (
	setmetatable({}, { __index = BaseClass }) :: any
) :: MyClass<any, any> & MyClass_statics;
(MyClass :: any).__index = MyClass
function MyClass.new<V, W>(): MyClass<V, W>
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	return (self :: any) :: MyClass<V, W>
end
type MyClassWithDefault<V = number, W = string> = BaseClass<V> & {}
type MyClassWithDefault_statics = { new: <V = number, W = string>() -> MyClassWithDefault<V, W> }
local MyClassWithDefault = (
	setmetatable({}, { __index = BaseClass }) :: any
) :: MyClassWithDefault<any, any> & MyClassWithDefault_statics;
(MyClassWithDefault :: any).__index = MyClassWithDefault
function MyClassWithDefault.new<V = number, W = string>(): MyClassWithDefault<V, W>
	local self = setmetatable({}, MyClassWithDefault) --[[ ROBLOX TODO: super constructor may be used ]]
	return (self :: any) :: MyClassWithDefault<V, W>
end
