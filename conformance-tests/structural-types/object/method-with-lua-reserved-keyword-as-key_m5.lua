-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/structural-types/object/method-with-lua-reserved-keyword-as-key_m5.js
local foo = {
	["repeat"] = function(self) end,
	["until"] = function(self) end,
	["not"] = function(self) end,
}
