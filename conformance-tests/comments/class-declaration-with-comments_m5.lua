--[[ BaseClass comment ]]
type BaseClass = {}
type BaseClass_statics = { new: () -> BaseClass }
local BaseClass = {} :: BaseClass & BaseClass_statics;
(BaseClass :: any).__index = BaseClass
function BaseClass.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	return (self :: any) :: BaseClass
end
--[[ MyClass comment ]]
type MyClass = BaseClass & {}
type MyClass_statics = { new: () -> MyClass }
local MyClass = (setmetatable({}, { __index = BaseClass }) :: any) :: MyClass & MyClass_statics;
(MyClass :: any).__index = MyClass
function MyClass.new(): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	return (self :: any) :: MyClass
end
