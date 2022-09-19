-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/statements/conditional/switch/multiple-fall-through-cases_m5.js
local condition_ = expr
if condition_ == "Oranges" or condition_ == "Mangoes" or condition_ == "Papayas" then
	say("I love it")
elseif condition_ == "Pineapples" or condition_ == "Strawberries" then
	say("I like it")
else
	say("I don't like it")
end
