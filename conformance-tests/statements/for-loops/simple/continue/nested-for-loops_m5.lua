for i = 0, 2 do
	if i == 1 then
		continue
	end
	foo(i)
	for j = 0, 4 do
		if j == 2 then
			continue
		end
		bar(i, j)
	end
end
