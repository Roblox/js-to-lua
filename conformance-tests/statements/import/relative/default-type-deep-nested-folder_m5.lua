-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/relative/default-type-deep-nested-folder_m5.ts
local bazModule = require(script.Parent.foo.bar.baz)
type baz = bazModule.default
