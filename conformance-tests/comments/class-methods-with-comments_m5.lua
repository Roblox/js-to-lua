type BaseClass = { --[[ Method comment in BaseClass ]]
	method: (self: BaseClass) -> any,
	--[[ Another comment in BaseClass ]]
	anotherMethod: (self: BaseClass) -> any,
}
local BaseClass = {}
BaseClass.__index = BaseClass
function BaseClass.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	return (self :: any) :: BaseClass
end
function BaseClass:method() end
function BaseClass:anotherMethod() end
type MyClass = BaseClass & { --[[ Method comment in MyClass ]]
	method: (self: MyClass) -> any,
	--[[ Another method in MyClass ]]
	anotherMethod: (self: MyClass) -> any,
}
local MyClass = setmetatable({}, { __index = BaseClass })
MyClass.__index = MyClass
function MyClass.new(): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	return (self :: any) :: MyClass
end
function MyClass:method() end
function MyClass:anotherMethod() end