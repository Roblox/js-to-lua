local falsy1 = nil
local falsy = nil
local foo = Boolean.toJSBoolean(falsy1) and falsy1 or falsy
