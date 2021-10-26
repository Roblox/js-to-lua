local arr = { 1, 2, 3 }
local function calculateFn(_v) end
for _, arrItem in ipairs(arr) do
	calculateFn(arrItem)
end
