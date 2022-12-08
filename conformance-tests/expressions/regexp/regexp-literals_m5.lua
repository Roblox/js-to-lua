-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/regexp/regexp-literals_m5.js
local Packages --[[ ROBLOX comment: must define Packages module ]]
local RegExp = require(Packages.RegExp)
local reg1 = RegExp("\\\\(?![{}()+?.^$])", "g") --[[ ROBLOX NOTE: global flag is not implemented yet ]]
local reg2 = RegExp("(\\/|\\\\(?!\\.))", "g") --[[ ROBLOX NOTE: global flag is not implemented yet ]]
local reg3 = RegExp("\\s*at.*\\(?(:\\d*:\\d*|native)\\)?")
local reg4 = RegExp("(\\r\\n|\\n|\\r)", "gm") --[[ ROBLOX NOTE: global flag is not implemented yet ]]
local reg5 = RegExp("^Symbol\\((.*)\\)(.*)$")
local reg6 = RegExp("jest")
local reg7 = RegExp("^(HTML\\w*Collection|NodeList)$")
local reg8 = RegExp("[\\u001b\\u009b]\\[\\d{1,2}m", "gu") --[[ ROBLOX NOTE: global flag is not implemented yet ]]
local reg9 = RegExp("^((HTML|SVG)\\w*)?Element$")
local reg10 = RegExp("[^.[\\\\]]+|(?=(?:\\\\.)(?:\\\\.|$))", "g") --[[ ROBLOX NOTE: global flag is not implemented yet ]]
local reg11 = RegExp("^you are using the wrong JDK$")
