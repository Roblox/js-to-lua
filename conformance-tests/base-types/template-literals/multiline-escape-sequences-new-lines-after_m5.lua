-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/base-types/template-literals/multiline-escape-sequences-new-lines-after_m5.js
local value = [[

backspace       --> abc]] .. "\b" .. [[

form feed       --> abc]] .. "\f" .. [[

new line        --> abc]] .. "\n" .. [[

carriage return   --> abc]] .. "\r" .. [[

horizontal tab  --> abc]] .. "\t" .. [[

vertical tab    --> abc]] .. "\v" .. [[

zero            --> abc]] .. "\0" .. [[

single quote    --> abc'
double quote    --> abc"
backtick        --> abc`
backslash       --> abc]] .. "\\" .. [[


-- regular characters but escaped

a
c
d
e
g
]]
