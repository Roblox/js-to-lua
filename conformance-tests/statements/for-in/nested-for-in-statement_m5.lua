local result = ""
for foo in fizz do
	for bar in buzz do
		result = tostring(result) .. ", " .. tostring(foo) .. ":" .. tostring(bar)
	end
end
