type BaseClass = { initializedProperty: any, notInitializedProperty: any } --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local BaseClass = {}
BaseClass.__index = BaseClass
BaseClass.staticProperty = false
function BaseClass.new()
	local self = setmetatable({}, BaseClass)
	self.initializedProperty = true
	return self
end
type MyClass = { initializedProperty: any, notInitializedProperty: any } --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local MyClass = setmetatable({}, { __index = BaseClass })
MyClass.__index = MyClass
MyClass.staticProperty = false
function MyClass.new()
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	self.initializedProperty = true
	return self
end
