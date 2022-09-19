-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/import/ts-import-equals/global-import-with-comments_m5.ts
local Packages --[[ ROBLOX comment: must define Packages module ]]
local boo = --[[a comment]]
	require(Packages.foo) --[[another comment]]
--[[yet another comment]]
