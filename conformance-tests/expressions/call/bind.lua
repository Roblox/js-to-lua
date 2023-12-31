-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/bind.js
local greet = {
	person = function(self, name)
		return "Hello " .. tostring(name)
	end,
}
local greetChris = function(...)
	return greet.person(greet, "Chris", ...)
end
local greetJan = function(...)
	return greet.person(greet, "Jan", ...)
end
greetChris()
greetJan()
