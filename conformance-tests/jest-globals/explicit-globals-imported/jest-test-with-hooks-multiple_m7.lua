-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/jest-globals/explicit-globals-imported/jest-test-with-hooks-multiple_m7.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local globalsModule = require(Packages["@jest"].globals)
local describe = globalsModule.describe
local it = globalsModule.it
local beforeAll = globalsModule.beforeAll
local afterAll = globalsModule.afterAll
local beforeEach = globalsModule.beforeEach
local afterEach = globalsModule.afterEach
describe("foo", function()
	beforeEach(function() end)
	afterEach(function() end)
	beforeAll(function() end)
	afterAll(function() end)
	it("bar", function() end)
	it("baz", function() end)
end)
describe("fizz", function()
	beforeEach(function() end)
	afterEach(function() end)
	beforeAll(function() end)
	afterAll(function() end)
	it("buzz", function() end)
	it("jazz", function() end)
end)
