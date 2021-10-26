local arr = { 1, 2, 3 }
local function calculateFn()
	return {}
end
for i = 0, 2 do
	arr[i + 1] = calculateFn()
end
