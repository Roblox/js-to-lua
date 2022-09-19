-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/continue/continue-with-comments.ts
local i = 0 -- This is a comment above the loop
while i ~= 10 do
	i += 1 -- This is a comment above continue
	continue -- This is a comment beside continue
	-- This is a comment below continue
end
