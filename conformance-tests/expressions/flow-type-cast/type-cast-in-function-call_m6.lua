-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/flow-type-cast/type-cast-in-function-call_m6.js
myFunction(item :: number)
myFunction((item :: number) :: T)
myFunction(((item :: number) :: T) :: V)
