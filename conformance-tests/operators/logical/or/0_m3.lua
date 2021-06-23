local falsy0 = false
local truthy = {}
local foo = Boolean.toJSBoolean(falsy0) and falsy0 or truthy
