local falsy4 = ""
local truthy = {}
local foo = Boolean.toJSBoolean(falsy4) and falsy4 or truthy
