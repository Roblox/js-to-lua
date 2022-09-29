-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/jest-globals/implicit-globals/jest-test-implicit-globals-with-variants_m7.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local JestGlobals = require(Packages.Dev.JestGlobals)
local describe = JestGlobals.describe
local fdescribe = JestGlobals.fdescribe
local fit = JestGlobals.fit
local it = JestGlobals.it
local test = JestGlobals.test
local xdescribe = JestGlobals.xdescribe
local xit = JestGlobals.xit
local xtest = JestGlobals.xtest
describe("normal describe test", function()
	it("normal it in describe test", function() end)
	test("normal test in describe test", function() end)
	fit("fit in describe test", function() end)
	xit("xit in describe test", function() end)
	xtest("xtest in describe test", function() end)
end)
fdescribe("fdescribe test", function()
	fit("fit in fdescribe test", function() end)
	xit("xit in fdescribe test", function() end)
	xtest("xtest in fdescribe test", function() end)
end)
xdescribe("xdescribe test", function()
	fit("fit inside xdescribe test", function() end)
	xit("xit inside xdescribe test", function() end)
	xtest("xtest inside xdescribe test", function() end)
end)
