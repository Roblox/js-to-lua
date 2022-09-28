-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/base-types/never/never-typed-while-true_m5.ts
local function keepProcessing(): never
	while true do
		log("I always does something and never ends.")
	end
end
