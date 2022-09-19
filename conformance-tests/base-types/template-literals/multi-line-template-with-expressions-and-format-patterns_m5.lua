-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/base-types/template-literals/multi-line-template-with-expressions-and-format-patterns_m5.js
local foo = ([[

value1%%s: %s%%
value2%%d: %s%%
value3%%f: %s%%
]]):format(tostring(v1), tostring(v2), tostring(v3))
