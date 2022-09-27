-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/jest-globals/explicit-globals-imported/jest-test-with-expect_m7.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local jestGlobalsModule = require(Packages["@jest"].globals)
local describe = jestGlobalsModule.describe
local it = jestGlobalsModule.it
local expect = jestGlobalsModule.expect
describe("foo", function()
	it("bar", function()
		local foo, bar = 1, 1
		expect(foo).toEqual(bar)
	end)
end)
