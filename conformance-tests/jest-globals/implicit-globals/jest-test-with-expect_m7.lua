-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/jest-globals/implicit-globals/jest-test-with-expect_m7.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local JestGlobals = require(Packages.Dev.JestGlobals)
local describe = JestGlobals.describe
local expect = JestGlobals.expect
local it = JestGlobals.it
describe("foo", function()
	it("bar", function()
		local foo, bar = 1, 1
		expect(foo).toEqual(bar)
	end)
end)
