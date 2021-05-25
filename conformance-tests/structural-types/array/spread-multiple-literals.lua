local arr1 = Array.concat({}, {1, 2}, {3, 4})
local arr2 = Array.concat({}, {5, 6}, {7, 8})
local combined = Array.concat({}, Array.spread(arr1), Array.spread(arr2), {9}, {10, 11})
