local truthy2 = {}
local falsy = nil

local foo = Boolean.toJSBoolean(truthy2) and truthy2 or falsy
