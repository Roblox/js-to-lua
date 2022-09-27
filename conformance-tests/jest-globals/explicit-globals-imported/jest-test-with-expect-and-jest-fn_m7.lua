-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/jest-globals/explicit-globals-imported/jest-test-with-expect-and-jest-fn_m7.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local jestGlobalsModule = require(Packages["@jest"].globals)
local jest = jestGlobalsModule.jest
local describe = jestGlobalsModule.describe
local it = jestGlobalsModule.it
local expect = jestGlobalsModule.expect
describe("foo", function()
	it("bar", function()
		local myFn = jest.fn()
		myFn(1)
		expect(myFn).toHaveBeenCalledWith(1)
	end)
end)
