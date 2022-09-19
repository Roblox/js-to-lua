-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/relative/default-type-same-folder_m5.ts
local fooModule = require(script.Parent.foo)
type foo = fooModule.default
