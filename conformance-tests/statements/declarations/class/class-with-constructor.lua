type BaseClass = {}
local BaseClass = {}
BaseClass.__index = BaseClass
function BaseClass.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	return (self :: any) :: BaseClass
end
type MyClass = {}
local MyClass = setmetatable({}, { __index = BaseClass })
MyClass.__index = MyClass
function MyClass.new(): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	return (self :: any) :: MyClass
end
