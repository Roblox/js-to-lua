-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/flow-type-cast/simple-type-cast_m6.js
local myVar = item :: number
local myOtherVar = (item :: number) :: T
local anotherVar = ((item :: number) :: T) :: V
