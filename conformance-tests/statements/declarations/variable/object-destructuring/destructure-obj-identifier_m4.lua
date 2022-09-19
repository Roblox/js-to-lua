-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/declarations/variable/object-destructuring/destructure-obj-identifier_m4.js
local obj = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
local foo, fizz, fuzz = obj.foo, obj.fizz, obj.fuzz
