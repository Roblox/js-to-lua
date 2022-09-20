-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/jest-globals/explicit-globals-imported/jest-test_m7.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local globalsModule = require(Packages["@jest"].globals)
local describe = globalsModule.describe
local it = globalsModule.it
describe("foo", function()
	it("bar", function() end)
end)