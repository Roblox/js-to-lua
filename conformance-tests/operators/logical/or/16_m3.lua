local truthy4 = "truthy"
local truthy = {}

local foo = Boolean.toJSBoolean(truthy4) and truthy4 or truthy
