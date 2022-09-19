-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/optional-call/multiple-optional-with-function-call_m5.js
local ref = (function()
	local ref = if typeof(foo) == "table" then foo.bar else nil
	return if ref ~= nil then ref() else nil
end)()
local v = if ref ~= nil then ref() else nil
