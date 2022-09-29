-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/known-imports/testing-library-known-imports_m8.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local testingLibraryDomModule = require(Packages.DomTestingLibrary)
local getByLabelText = testingLibraryDomModule.getByLabelText
local getByText = testingLibraryDomModule.getByText
local getByTestId = testingLibraryDomModule.getByTestId
local queryByTestId = testingLibraryDomModule.queryByTestId
local waitFor = testingLibraryDomModule.waitFor
local testingLibraryReactModule = require(Packages.ReactTestingLibrary)
local render = testingLibraryReactModule.render
local screen = testingLibraryReactModule.screen
