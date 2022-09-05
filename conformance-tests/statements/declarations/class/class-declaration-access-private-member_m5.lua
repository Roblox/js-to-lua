type Person = { getGreeting: (self: Person) -> any }
type Person_private = { --
	-- *** PUBLIC ***
	--
	getGreeting: (self: Person_private) -> any,
	--
	-- *** PRIVATE ***
	--
	privateName: string,
}
type Person_statics = { new: (privateName: string?) -> Person }
local Person = {} :: Person & Person_statics
local Person_private = Person :: Person_private & Person_statics;
(Person :: any).__index = Person
function Person_private.new(privateName: string?): Person
	local self = setmetatable({}, Person)
	if privateName == nil then
		privateName = "World"
	end
	self.privateName = privateName
	return (self :: any) :: Person
end
function Person_private:getGreeting()
	return "Hello" .. tostring(self.privateName)
end
