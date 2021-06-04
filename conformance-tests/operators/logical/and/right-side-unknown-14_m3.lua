local truthy2 = {}
local truthy = {}

local foo = (function()
    if Boolean.toJSBoolean(truthy2) then
        return truthy
    else
        return truthy2
    end
end)()
