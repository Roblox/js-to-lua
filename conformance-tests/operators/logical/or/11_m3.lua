local falsy5 = 0 / 0
local falsy = nil
local foo = Boolean.toJSBoolean(falsy5) and falsy5 or falsy
