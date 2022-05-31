local value = ([[

backspace       --> abc%s]] .. "\b%s" .. [[def
form feed       --> abc%s]] .. "\f%s" .. [[def
new line        --> abc%s]] .. "\n%s" .. [[def
carriage return   --> abc%s]] .. "\r%s" .. [[def
horizontal tab  --> abc%s]] .. "\t%s" .. [[def
vertical tab    --> abc%s]] .. "\v%s" .. [[def
zero            --> abc%s]] .. "\0%s" .. [[def
single quote    --> abc%s'%sdef
double quote    --> abc%s"%sdef
backtick        --> abc%s`%sdef
backspace       --> abc%s]] .. "\\%s" .. [[def

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
