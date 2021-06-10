local a, b
local c = (function()
    if Boolean.toJSBoolean(a) then
        return false
    else
        return b
    end
end)()
