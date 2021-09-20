type BaseClass = {} --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local BaseClass = {}
BaseClass.__index = BaseClass
function BaseClass.new()
	local self = setmetatable({}, BaseClass)
	return self
end
type MyClass = {} --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local MyClass = setmetatable({}, { __index = BaseClass })
MyClass.__index = MyClass
function MyClass.new()
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	return self
end
