local foo = ([[

value1%%s:]] .. "\t%s" .. ([[%%]] .. "\n" .. [[

value2%%d:]] .. "\t") .. "%s" .. ([[%%]] .. "\n" .. [[

value3%%f:]] .. "\t") .. "%s" .. ([[%%]] .. "\n" .. [[

]])):format(tostring(v1), tostring(v2), tostring(v3))
