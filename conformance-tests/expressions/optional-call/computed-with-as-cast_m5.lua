local ref = if typeof(foo :: any) == "table" then (foo :: any)["bar"] else nil
local v = if ref ~= nil then ref() else nil
