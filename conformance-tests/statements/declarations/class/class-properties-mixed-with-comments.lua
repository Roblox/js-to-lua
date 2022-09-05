type BaseClass = { --
	-- comment not specified 1
	initializedProperty: boolean, --
	-- comment not specified 2
	notInitializedProperty: any, --
	-- comment not specified 3
	--
	-- comment public 1
	initializedPropertyPublic: boolean, --
	-- comment public 2
	notInitializedPropertyPublic: any, --
	-- comment public 3
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
	--
	-- comment protected 1
	initializedPropertyProtected: boolean, --
	-- comment protected 2
	notInitializedPropertyProtected: any, --
	-- comment protected 3
	--
	-- *** PRIVATE ***
	--
	--
	-- comment private 1
	initializedPropertyPrivate: boolean, --
	-- comment private 2
	notInitializedPropertyPrivate: any, --
	-- comment private 3
	-- comment before method
	method: (self: BaseClass_private) -> any, --
	-- comment after method
}
type BaseClass_statics = { new: () -> BaseClass }
local BaseClass = {} :: BaseClass & BaseClass_statics
local BaseClass_private = BaseClass :: BaseClass_private & BaseClass_statics;
(BaseClass :: any).__index = BaseClass
BaseClass.staticProperty = false
BaseClass.staticPropertyPublic = false
BaseClass_private.staticPropertyPrivate = false
BaseClass_private.staticPropertyProtected = false
--
-- comment before constructor
function BaseClass_private.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	self.initializedProperty = true
	self.initializedPropertyPublic = true
	self.initializedPropertyPrivate = true
	self.initializedPropertyProtected = true
	--
	-- comment in constructor
	return (self :: any) :: BaseClass
end --
function BaseClass_private:method() end
