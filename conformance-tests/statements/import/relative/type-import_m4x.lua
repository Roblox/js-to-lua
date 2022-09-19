-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/relative/type-import_m4x.ts
local fooModule = require(script.Parent.foo)
type foo = fooModule.foo
