-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/sequence/4_m4.js
local b, c, d, e = 1, 2
local function a()
	b = b + 1
	e = tostring(c) .. "hello"
	d = true
end
