-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment/destructure-obj-identifier-with-alias_m4.js
local obj = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
local foo1, fizz1, fuzz
foo1, fizz1, fuzz = obj.foo, obj.fizz, obj.fuzz
