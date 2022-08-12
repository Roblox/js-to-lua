type BaseClass = { initializedProperty: boolean, notInitializedProperty: any }
type BaseClass_statics = { new: () -> BaseClass }
local BaseClass = {} :: BaseClass & BaseClass_statics;
(BaseClass :: any).__index = BaseClass
BaseClass.staticProperty = false
function BaseClass.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	self.initializedProperty = true
	return (self :: any) :: BaseClass
end
type MyClass = BaseClass & { initializedProperty: boolean, notInitializedProperty: any }
type MyClass_statics = { new: () -> MyClass }
local MyClass = (setmetatable({}, { __index = BaseClass }) :: any) :: MyClass & MyClass_statics;
(MyClass :: any).__index = MyClass
MyClass.staticProperty = false
function MyClass.new(): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	self.initializedProperty = true
	return (self :: any) :: MyClass
end
