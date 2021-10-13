type BaseClass = { method: any, abstractMethod: any } --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local BaseClass = {}
BaseClass.__index = BaseClass
function BaseClass.new()
	local self = setmetatable({}, BaseClass)
	return self
end
function BaseClass:method() end
function BaseClass.staticMethod() end
function BaseClass:abstractMethod()
	error("not implemented abstract method")
end
type MyClass = { method: any, abstractMethod: any } --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local MyClass = setmetatable({}, { __index = BaseClass })
MyClass.__index = MyClass
function MyClass.new()
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	return self
end
function MyClass:method() end
function MyClass.staticMethod() end
function MyClass:abstractMethod() end
