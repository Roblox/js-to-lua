-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/operators/assignment/destructure-obj-identifier_m4.js
local obj = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
local foo, fizz, fuzz
foo, fizz, fuzz = obj.foo, obj.fizz, obj.fuzz
