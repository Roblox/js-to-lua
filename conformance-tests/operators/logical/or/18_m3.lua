local truthy1 = 1
local falsy = nil

local foo = Boolean.toJSBoolean(truthy1) and truthy1 or falsy
