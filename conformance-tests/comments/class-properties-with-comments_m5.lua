-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/class-properties-with-comments_m5.js
type BaseClass = { --[[ Initialized property comment in BaseClass ]]
	initializedProperty: boolean,
	--[[ Not initialzed property comment in BaseClass ]]
	notInitializedProperty: any,
}
type BaseClass_statics = { new: () -> BaseClass }
local BaseClass = {} :: BaseClass & BaseClass_statics;
(BaseClass :: any).__index = BaseClass
BaseClass.staticProperty = false
function BaseClass.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	self.initializedProperty = true
	return (self :: any) :: BaseClass
end
type MyClass = BaseClass & { --[[ Initialized property comment in MyClass ]]
	initializedProperty: boolean,
	--[[ Not initialzed property comment in MyClass ]]
	notInitializedProperty: any,
	--[[ Static comment in MyClass ]]
}
type MyClass_statics = { new: () -> MyClass }
local MyClass = (setmetatable({}, { __index = BaseClass }) :: any) :: MyClass & MyClass_statics;
(MyClass :: any).__index = MyClass
MyClass.staticProperty = false
function MyClass.new(): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	self.initializedProperty = true
	return (self :: any) :: MyClass
end
