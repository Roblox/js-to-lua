-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/optional-call/basic-multiple-optional-statements_m5.js
local ref = if typeof(if typeof(foo) == "table" then foo.bar else nil) == "table"
	then (if typeof(foo) == "table" then foo.bar else nil).fizz
	else nil
if ref ~= nil then
	ref()
end
