local truthy2 = {}
local truthy = {}

local foo = Boolean.toJSBoolean(truthy2) and truthy2 or truthy
