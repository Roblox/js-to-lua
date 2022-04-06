local arr = { {}, {}, {} }
local function calculateFn(v)
	return { [tostring(v)] = v }
end
for i = 0, 2 do
	arr[i + 1].cachedValue = calculateFn(i)
end
