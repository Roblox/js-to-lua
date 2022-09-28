-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/base-types/never/never-typed-throw-error_m5.ts
local function throwError(errorMsg: string): never
	error(errorMsg)
end
