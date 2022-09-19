-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/flow-type-cast/type-cast-in-function-return_m6.js
local function myFunction()
	return item :: number
end
local function myOtherFunction()
	return (item :: number) :: T
end
