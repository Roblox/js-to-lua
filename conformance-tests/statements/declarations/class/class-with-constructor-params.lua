-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/class/class-with-constructor-params.ts
type BaseClass = { publicConstructorParam: any }
type BaseClass_private = { --
	-- *** PUBLIC ***
	--
	publicConstructorParam: any,
	--
	-- *** PROTECTED ***
	--
	protectedConstructorParam: any,
	--
	-- *** PRIVATE ***
	--
	privateConstructorParam: any,
}
type BaseClass_statics = {
	new: (
		notAssignedParam: any,
		publicConstructorParam: any,
		privateConstructorParam: any,
		protectedConstructorParam: any
	) -> BaseClass,
}
local BaseClass = {} :: BaseClass & BaseClass_statics
local BaseClass_private = BaseClass :: BaseClass_private & BaseClass_statics;
(BaseClass :: any).__index = BaseClass
function BaseClass_private.new(
	notAssignedParam,
	publicConstructorParam,
	privateConstructorParam,
	protectedConstructorParam
): BaseClass
	local self = setmetatable({}, BaseClass)
	self.publicConstructorParam = publicConstructorParam
	self.privateConstructorParam = privateConstructorParam
	self.protectedConstructorParam = protectedConstructorParam
	return (self :: any) :: BaseClass
end
type MyClass = BaseClass & { publicConstructorParam: any }
type MyClass_private = BaseClass & { --
	-- *** PUBLIC ***
	--
	publicConstructorParam: any,
	--
	-- *** PROTECTED ***
	--
	protectedConstructorParam: any,
	--
	-- *** PRIVATE ***
	--
	privateConstructorParam: any,
}
type MyClass_statics = {
	new: (
		notAssignedParam: any,
		publicConstructorParam: any,
		privateConstructorParam: any,
		protectedConstructorParam: any
	) -> MyClass,
}
local MyClass = (setmetatable({}, { __index = BaseClass }) :: any) :: MyClass & MyClass_statics
local MyClass_private = MyClass :: MyClass_private & MyClass_statics;
(MyClass :: any).__index = MyClass
function MyClass_private.new(
	notAssignedParam,
	publicConstructorParam,
	privateConstructorParam,
	protectedConstructorParam
): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	self.publicConstructorParam = publicConstructorParam
	self.privateConstructorParam = privateConstructorParam
	self.protectedConstructorParam = protectedConstructorParam
	return (self :: any) :: MyClass
end
