local truthy0 = true
local truthy = {}

local foo = Boolean.toJSBoolean(truthy0) and truthy0 or truthy
