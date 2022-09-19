-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/complex/write-arr-element-property_m5.js
local arr = { {}, {}, {} }
local function calculateFn()
	return {}
end
for _, arrItem in ipairs(arr) do
	arrItem.cachedValue = calculateFn()
end
