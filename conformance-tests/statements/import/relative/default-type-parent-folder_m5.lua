-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/relative/default-type-parent-folder_m5.ts
local barModule = require(script.Parent.Parent.bar)
type bar = barModule.default
