-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/complex/read-arr-index-only_m5.js
local arr = { 1, 2, 3 }
local function calculateFn(_v) end
for _, arrItem in ipairs(arr) do
	calculateFn(arrItem)
end
