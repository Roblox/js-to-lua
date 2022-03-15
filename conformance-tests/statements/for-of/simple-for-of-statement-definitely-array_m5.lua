local result = ""
for _, foo in ipairs({ 1, 2, 3 }) do
	result = tostring(result) .. ", " .. tostring(foo)
end
