local a = ({ 1, { 2, 3 } })[1]
local b, c = table.unpack(table.unpack({ 1, { 2, 3 } }, 2, 2), 1, 2)
