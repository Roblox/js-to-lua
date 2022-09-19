-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/logical/nullish-coalescing/right-side-side-effect_m5.js
local foo
local bar = if foo ~= nil
	then foo
	else (function()
		foo = 0
		return foo
	end)()
