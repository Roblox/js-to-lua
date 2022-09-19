-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/class/class-declaration-access-private-member_m5.ts
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
type Person_statics = { new: (privateName_: string?) -> Person }
local Person = {} :: Person & Person_statics
local Person_private = Person :: Person_private & Person_statics;
(Person :: any).__index = Person
function Person_private.new(privateName_: string?): Person
	local self = setmetatable({}, Person)
	local privateName: string = if privateName_ ~= nil then privateName_ else "World"
	self.privateName = privateName
	return (self :: any) :: Person
end
function Person_private:getGreeting()
	return "Hello" .. tostring(self.privateName)
end
