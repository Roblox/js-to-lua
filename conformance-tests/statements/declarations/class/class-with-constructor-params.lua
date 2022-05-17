type BaseClass = { publicConstructorParam: any }
local BaseClass = {}
BaseClass.__index = BaseClass
function BaseClass.new(notAssignedParam, publicConstructorParam, privateConstructorParam): BaseClass
	local self = setmetatable({}, BaseClass)
	self.publicConstructorParam = publicConstructorParam
	self.privateConstructorParam = privateConstructorParam
	return (self :: any) :: BaseClass
end
type MyClass = BaseClass & { publicConstructorParam: any }
local MyClass = setmetatable({}, { __index = BaseClass })
MyClass.__index = MyClass
function MyClass.new(notAssignedParam, publicConstructorParam, privateConstructorParam): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	self.publicConstructorParam = publicConstructorParam
	self.privateConstructorParam = privateConstructorParam
	return (self :: any) :: MyClass
end
