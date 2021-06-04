local truthy4 = "truthy"
local falsy = nil

local foo = (function()
    if Boolean.toJSBoolean(truthy4) then
        return falsy
    else
        return truthy4
    end
end)()
