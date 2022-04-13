local foo = {}
local a = if typeof(foo) == "table" then foo["repeat"] else nil
local b = if typeof(foo) == "table" then foo["until"] else nil
local nested = if typeof(if typeof(foo) == "table" then foo["repeat"] else nil) == "table"
	then (if typeof(foo) == "table" then foo["repeat"] else nil)["until"]
	else nil
local mixed = if typeof(if typeof(foo) == "table" then foo["repeat"] else nil) == "table"
	then (if typeof(foo) == "table" then foo["repeat"] else nil).string
	else nil
