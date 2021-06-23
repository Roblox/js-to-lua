local falsy3 = 0
local truthy = {}
local foo = Boolean.toJSBoolean(falsy3) and falsy3 or truthy
