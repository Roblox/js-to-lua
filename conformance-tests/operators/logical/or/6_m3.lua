local falsy0 = false
local falsy = nil
local foo = Boolean.toJSBoolean(falsy0) and falsy0 or falsy
