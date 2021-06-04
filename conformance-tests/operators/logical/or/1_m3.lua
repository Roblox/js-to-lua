local falsy1 = nil
local truthy = {}

local foo = Boolean.toJSBoolean(falsy1) and falsy1 or truthy
