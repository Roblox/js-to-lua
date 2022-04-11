local arr = { 1, 2, 3 }
local a = table.unpack(arr, 1, 1)
local b = table.pack(table.unpack(arr, 2))
