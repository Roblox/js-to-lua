local a, b, c, d
if Boolean.toJSBoolean(a) then
	c = true
	d = false
elseif Boolean.toJSBoolean(b) then
	c = false
	d = true
else
	c = false
	d = false
end