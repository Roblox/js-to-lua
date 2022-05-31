local value = ([[

backspace       --> abc%s]] .. "\b%s" .. [[

form feed       --> abc%s]] .. "\f%s" .. [[

new line        --> abc%s]] .. "\n%s" .. [[

carriage return   --> abc%s]] .. "\r%s" .. [[

horizontal tab  --> abc%s]] .. "\t%s" .. [[

vertical tab    --> abc%s]] .. "\v%s" .. [[

zero            --> abc%s]] .. "\0%s" .. [[

single quote    --> abc%s'%s
double quote    --> abc%s"%s
backtick        --> abc%s`%s
backspace       --> abc%s]] .. "\\%s" .. [[


-- regular characters but escaped

a
c
d
e
g
]]):format(
	tostring(foo),
	tostring(bar),
	tostring(foo),
	tostring(bar),
	tostring(foo),
	tostring(bar),
	tostring(foo),
	tostring(bar),
	tostring(foo),
	tostring(bar),
	tostring(foo),
	tostring(bar),
	tostring(foo),
	tostring(bar),
	tostring(foo),
	tostring(bar),
	tostring(foo),
	tostring(bar),
	tostring(foo),
	tostring(bar),
	tostring(foo),
	tostring(bar)
)
