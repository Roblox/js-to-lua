type BaseClass = {}
type BaseClass_private = { --
	-- *** PRIVATE ***
	--
	initializedProperty: boolean,
	notInitializedProperty: any,
}
type BaseClass_statics = { new: () -> BaseClass }
local BaseClass = {} :: BaseClass & BaseClass_statics
local BaseClass_private = BaseClass :: BaseClass_private & BaseClass_statics;
(BaseClass :: any).__index = BaseClass
BaseClass_private.staticProperty = false
function BaseClass_private.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	self.initializedProperty = true
	return (self :: any) :: BaseClass
end
type MyClass = BaseClass & {}
type MyClass_private = BaseClass & { --
	-- *** PRIVATE ***
	--
	initializedProperty: boolean,
	notInitializedProperty: any,
}
type MyClass_statics = { new: () -> MyClass }
local MyClass = (setmetatable({}, { __index = BaseClass }) :: any) :: MyClass & MyClass_statics
local MyClass_private = MyClass :: MyClass_private & MyClass_statics;
(MyClass :: any).__index = MyClass
MyClass_private.staticProperty = false
function MyClass_private.new(): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	self.initializedProperty = true
	return (self :: any) :: MyClass
end
