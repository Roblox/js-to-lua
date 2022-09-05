type BaseClass = {
	initializedProperty: boolean,
	notInitializedProperty: any,
	initializedPropertyPublic: boolean,
	notInitializedPropertyPublic: any,
}
type BaseClass_private = { --
	-- *** PUBLIC ***
	--
	initializedProperty: boolean,
	notInitializedProperty: any,
	initializedPropertyPublic: boolean,
	notInitializedPropertyPublic: any,
	--
	-- *** PROTECTED ***
	--
	initializedPropertyProtected: boolean,
	notInitializedPropertyProtected: any,
	--
	-- *** PRIVATE ***
	--
	initializedPropertyPrivate: boolean,
	notInitializedPropertyPrivate: any,
}
type BaseClass_statics = { new: () -> BaseClass }
local BaseClass = {} :: BaseClass & BaseClass_statics
local BaseClass_private = BaseClass :: BaseClass_private & BaseClass_statics;
(BaseClass :: any).__index = BaseClass
BaseClass.staticProperty = false
BaseClass.staticPropertyPublic = false
BaseClass_private.staticPropertyPrivate = false
BaseClass_private.staticPropertyProtected = false
function BaseClass_private.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	self.initializedProperty = true
	self.initializedPropertyPublic = true
	self.initializedPropertyPrivate = true
	self.initializedPropertyProtected = true
	return (self :: any) :: BaseClass
end
type MyClass = BaseClass & {
	initializedProperty: boolean,
	notInitializedProperty: any,
	initializedPropertyPublic: boolean,
	notInitializedPropertyPublic: any,
}
type MyClass_private = BaseClass & { --
	-- *** PUBLIC ***
	--
	initializedProperty: boolean,
	notInitializedProperty: any,
	initializedPropertyPublic: boolean,
	notInitializedPropertyPublic: any,
	--
	-- *** PROTECTED ***
	--
	initializedPropertyProtected: boolean,
	notInitializedPropertyProtected: any,
	--
	-- *** PRIVATE ***
	--
	initializedPropertyPrivate: boolean,
	notInitializedPropertyPrivate: any,
}
type MyClass_statics = { new: () -> MyClass }
local MyClass = (setmetatable({}, { __index = BaseClass }) :: any) :: MyClass & MyClass_statics
local MyClass_private = MyClass :: MyClass_private & MyClass_statics;
(MyClass :: any).__index = MyClass
MyClass.staticProperty = false
MyClass.staticPropertyPublic = false
MyClass_private.staticPropertyPrivate = false
MyClass_private.staticPropertyProtected = false
function MyClass_private.new(): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	self.initializedProperty = true
	self.initializedPropertyPublic = true
	self.initializedPropertyPrivate = true
	self.initializedPropertyProtected = true
	return (self :: any) :: MyClass
end
