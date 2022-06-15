local result = ""
for foo in { 1, 2, 3 } do
	result = tostring(result) .. ", " .. tostring(foo)
end
