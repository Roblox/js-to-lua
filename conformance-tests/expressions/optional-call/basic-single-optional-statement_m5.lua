-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/optional-call/basic-single-optional-statement_m5.js
local ref = if typeof(foo) == "table" then foo.bar else nil
if ref ~= nil then
	ref()
end
