-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/jest-globals/implicit-globals/jest-test-with-expect-and-jest-fn_m7.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local JestGlobals = require(Packages.Dev.JestGlobals)
local describe = JestGlobals.describe
local expect = JestGlobals.expect
local it = JestGlobals.it
local jest = JestGlobals.jest
describe("foo", function()
	it("bar", function()
		local myFn = jest.fn()
		myFn(1)
		expect(myFn).toHaveBeenCalledWith(1)
	end)
end)
