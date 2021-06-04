local truthy0 = true
local falsy = nil

local foo = Boolean.toJSBoolean(truthy0) and truthy0 or falsy
