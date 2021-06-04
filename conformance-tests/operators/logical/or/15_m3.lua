local truthy3 = {}
local truthy = {}

local foo = Boolean.toJSBoolean(truthy3) and truthy3 or truthy
