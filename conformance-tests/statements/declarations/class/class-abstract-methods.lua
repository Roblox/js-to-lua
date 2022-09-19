-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/class/class-abstract-methods.ts
type BaseClass = { method: (self: BaseClass) -> any, abstractMethod: (self: BaseClass) -> any }
type BaseClass_statics = { new: () -> BaseClass }
local BaseClass = {} :: BaseClass & BaseClass_statics;
(BaseClass :: any).__index = BaseClass
function BaseClass.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	return (self :: any) :: BaseClass
end
function BaseClass:method() end
function BaseClass.staticMethod() end
function BaseClass:abstractMethod()
	error("not implemented abstract method")
end
type MyClass = BaseClass & { method: (self: MyClass) -> any, abstractMethod: (self: MyClass) -> any }
type MyClass_statics = { new: () -> MyClass }
local MyClass = (setmetatable({}, { __index = BaseClass }) :: any) :: MyClass & MyClass_statics;
(MyClass :: any).__index = MyClass
function MyClass.new(): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	return (self :: any) :: MyClass
end
function MyClass:method() end
function MyClass.staticMethod() end
function MyClass:abstractMethod() end
