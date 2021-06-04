local falsy2 = nil
local falsy = nil

local foo = Boolean.toJSBoolean(falsy2) and falsy2 or falsy
