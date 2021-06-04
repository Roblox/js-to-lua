local falsy0 = false
local truthy = {}

local foo = (function()
    if Boolean.toJSBoolean(falsy0) then
        return truthy
    else
        return falsy0
    end
end)()
