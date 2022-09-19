-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/base-types/template-literals/single-line-template-literal-with-escaped-chars_m5.js
local value = "foo"
value = ("\\%s"):format(tostring(value))
value = ("\n%s"):format(tostring(value))
value = ("\t%s"):format(tostring(value))
