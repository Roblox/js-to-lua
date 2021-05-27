local v = not (function (exp)
    if(exp == false or exp == nil or exp == 0 or exp == "") then return false end
    return true
    end
)(foo)
