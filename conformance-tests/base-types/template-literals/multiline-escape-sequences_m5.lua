-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/base-types/template-literals/multiline-escape-sequences_m5.js
local value = [[

backspace       --> abc]] .. "\b" .. [[def
form feed       --> abc]] .. "\f" .. [[def
new line        --> abc]] .. "\n" .. [[def
carriage return   --> abc]] .. "\r" .. [[def
horizontal tab  --> abc]] .. "\t" .. [[def
vertical tab    --> abc]] .. "\v" .. [[def
zero            --> abc]] .. "\0" .. [[def
single quote    --> abc'def
double quote    --> abc"def
backtick        --> abc`def
backspace       --> abc]] .. "\\" .. [[def

-- regular characters but escaped

a
c
d
e
g
]]
