local falsy2 = nil
local truthy = {}

local foo = Boolean.toJSBoolean(falsy2) and falsy2 or truthy
