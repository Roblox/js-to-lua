-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/jest-globals/implicit-globals/jest-test-implicit-globals-with-hooks-partial-explicit-import_m7.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local JestGlobals = require(Packages.Dev.JestGlobals)
local afterAll = JestGlobals.afterAll
local afterEach = JestGlobals.afterEach
local beforeAll = JestGlobals.beforeAll
local beforeEach = JestGlobals.beforeEach
local jestGlobalsModule = require(Packages["@jest"].globals)
local it = jestGlobalsModule.it
local describe = jestGlobalsModule.describe
describe("foo", function()
	beforeEach(function() end)
	afterEach(function() end)
	beforeAll(function() end)
	afterAll(function() end)
	it("bar", function() end)
end)
