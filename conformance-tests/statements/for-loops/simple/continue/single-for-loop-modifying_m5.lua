do
	local i = 0
	while i < 10 do
		if i == 3 then
			i += 2
			i += 1
			continue
		end
		foo(i)
		i = i + 1
	end
end
