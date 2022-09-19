-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/return/return-conditional-expression_m5.js
local function foo()
	return if bar == nil then baz else fizz
end
