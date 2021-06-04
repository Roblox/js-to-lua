local truthy0 = true
local truthy = {}

local foo = (function()
    if Boolean.toJSBoolean(truthy0) then
        return truthy
    else
        return truthy0
    end
end)()
