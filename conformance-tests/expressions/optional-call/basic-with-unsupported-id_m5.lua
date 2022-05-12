local ref = if typeof(foo) == "table" then foo["$$typeof"] else nil
local v = if ref ~= nil then ref() else nil
