-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/base-types/template-literals/multi-line-template-with-expressions-escaped-chars-and-format-patterns_m5.js
local foo = ([[

value1%%s:]] .. "\t%s" .. ([[%%]] .. "\n" .. [[

value2%%d:]] .. "\t") .. "%s" .. ([[%%]] .. "\n" .. [[

value3%%f:]] .. "\t") .. "%s" .. ([[%%]] .. "\n" .. [[

]])):format(tostring(v1), tostring(v2), tostring(v3))
