do
	local i = 0
	while i < 10 do
		foo(i)
		if i == 3 then
			i += 2
			i += 1
			continue
		end
		do
			local j = 0
			while j < 5 do
				if i == j then
					j *= 2
					j += 1
					continue
				end
				bar(i, j)
				j += 1
			end
		end
		i += 1
	end
end
