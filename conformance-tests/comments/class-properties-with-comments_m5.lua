type BaseClass = { --[[ Initialized property comment in BaseClass ]]
	initializedProperty: boolean,
	--[[ Not initialzed property comment in BaseClass ]]
	notInitializedProperty: any,
}
local BaseClass = {}
BaseClass.__index = BaseClass
BaseClass.staticProperty = false
function BaseClass.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	self.initializedProperty = true
	return (self :: any) :: BaseClass
end
type MyClass = BaseClass & { --[[ Initialized property comment in MyClass ]]
	initializedProperty: boolean,
	--[[ Not initialzed property comment in MyClass ]]
	notInitializedProperty: any,
	--[[ Static comment in MyClass ]]
}
local MyClass = setmetatable({}, { __index = BaseClass })
MyClass.__index = MyClass
MyClass.staticProperty = false
function MyClass.new(): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	self.initializedProperty = true
	return (self :: any) :: MyClass
end
