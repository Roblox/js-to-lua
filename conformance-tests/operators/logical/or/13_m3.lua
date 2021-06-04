local truthy1 = 1
local truthy = {}

local foo = Boolean.toJSBoolean(truthy1) and truthy1 or truthy
