local truthy4 = "truthy"
local truthy = {}

local foo = (function()
    if Boolean.toJSBoolean(truthy4) then
        return truthy
    else
        return truthy4
    end
end)()
