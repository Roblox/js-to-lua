-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/comments/copyright/jsdoc/license-tag/copyright-with-qualified-name-import_m5.ts
--[[*
 * Utility functions for the foo package.
 * @module foo/util
 * @license MIT
 ]]
local barModule = require(script.Parent.bar)
type Foo = barModule.Foo
type Foo_Fizz = barModule.Foo_Fizz
local fizz: Foo_Fizz = "buzz"
