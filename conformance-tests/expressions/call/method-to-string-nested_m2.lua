-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/method-to-string-nested_m2.js
local obj = { someNestedProp = {} }
tostring(obj.someNestedProp)
