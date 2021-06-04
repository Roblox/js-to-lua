local truthy4 = "truthy"
local falsy = nil

local foo = Boolean.toJSBoolean(truthy4) and truthy4 or falsy
