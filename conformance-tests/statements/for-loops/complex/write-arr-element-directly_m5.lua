-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/complex/write-arr-element-directly_m5.js
local arr = { 1, 2, 3 }
local function calculateFn()
	return {}
end
for i = 0, 2 do
	arr[i + 1] = calculateFn()
end
