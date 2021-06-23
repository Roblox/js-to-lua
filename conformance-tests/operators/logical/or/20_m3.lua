local truthy3 = {}
local falsy = nil
local foo = Boolean.toJSBoolean(truthy3) and truthy3 or falsy
