-- ROBLOX upstream: https://github.com/Roblox/js-to-lua/blob/sha/conformance-tests/expressions/call/special-cases/chalk-call-chained-add-string_m5.js
local yellowBoldGreeting = chalk.yellow(chalk.bold("Hello")) .. "world"
local yellowBoldUnderlinedGreeting = chalk.yellow(chalk.bold(chalk.underline("Hello"))) .. "world"
