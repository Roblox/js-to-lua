-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/conditional/switch/one-fall-through-case-with-breaks_m4.js
local a, b
local condition_ = a
if condition_ == 0 or condition_ == 1 then
	b = 1
elseif condition_ == 2 then
	b = 2
else
	b = 3
end
