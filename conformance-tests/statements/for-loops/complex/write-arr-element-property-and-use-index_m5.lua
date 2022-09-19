-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/for-loops/complex/write-arr-element-property-and-use-index_m5.js
local arr = { {}, {}, {} }
local function calculateFn(v)
	return { [tostring(v)] = v }
end
for i = 0, 2 do
	arr[i + 1].cachedValue = calculateFn(i)
end
