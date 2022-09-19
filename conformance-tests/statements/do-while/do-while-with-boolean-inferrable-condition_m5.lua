-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/do-while/do-while-with-boolean-inferrable-condition_m5.js
local i = 0
repeat
	i += 1
until not (i ~= 10)
