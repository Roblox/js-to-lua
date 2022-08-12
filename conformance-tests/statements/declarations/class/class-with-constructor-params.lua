type BaseClass = { publicConstructorParam: any }
type BaseClass_statics = {
	new: (
		notAssignedParam: any,
		publicConstructorParam: any,
		privateConstructorParam: any
	) -> BaseClass,
}
local BaseClass = {} :: BaseClass & BaseClass_statics;
(BaseClass :: any).__index = BaseClass
function BaseClass.new(notAssignedParam, publicConstructorParam, privateConstructorParam): BaseClass
	local self = setmetatable({}, BaseClass)
	self.publicConstructorParam = publicConstructorParam
	self.privateConstructorParam = privateConstructorParam
	return (self :: any) :: BaseClass
end
type MyClass = BaseClass & { publicConstructorParam: any }
type MyClass_statics = {
	new: (
		notAssignedParam: any,
		publicConstructorParam: any,
		privateConstructorParam: any
	) -> MyClass,
}
local MyClass = (setmetatable({}, { __index = BaseClass }) :: any) :: MyClass & MyClass_statics;
(MyClass :: any).__index = MyClass
function MyClass.new(notAssignedParam, publicConstructorParam, privateConstructorParam): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	self.publicConstructorParam = publicConstructorParam
	self.privateConstructorParam = privateConstructorParam
	return (self :: any) :: MyClass
end
