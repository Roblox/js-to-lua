-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/conditional/switch/all-cases-return-break-or-continue_m5.js
local function hello()
	do
		local i = 0
		while
			i
			< 2 --[[ ROBLOX CHECK: operator '<' works only if either both arguments are strings or both are a number ]]
		do
			local condition_ = i
			if condition_ == 0 then
			elseif condition_ == 1 then
				i += 1
				continue
			elseif condition_ == 2 then
				return
			end
			i += 1
		end
	end
end
