local i = 0
while i < 3 do
	foo(i)
	if i == 3 then
		i += 1
	end
	local j = 0
	while j < 5 do
		if i == j then
			j *= 2
		end
		bar(i, j)
		j = j + 1
	end
	i = i + 1
end
