local arr = { {}, {}, {} }
local function calculateFn()
	return {}
end
for _, arrItem in ipairs(arr) do
	arrItem.cachedValue = calculateFn()
end
