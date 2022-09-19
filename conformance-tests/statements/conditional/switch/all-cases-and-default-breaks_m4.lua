-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/conditional/switch/all-cases-and-default-breaks_m4.js
local a, b = 0
local condition_ = a
a += 1
if condition_ == 0 then
	b = 1
elseif condition_ == 1 then
	b = 2
else
	b = 3
end
