const value = `
backspace       --> abc${foo}\b${bar}def
form feed       --> abc${foo}\f${bar}def
new line        --> abc${foo}\n${bar}def
carriage return   --> abc${foo}\r${bar}def
horizontal tab  --> abc${foo}\t${bar}def
vertical tab    --> abc${foo}\v${bar}def
zero            --> abc${foo}\0${bar}def
single quote    --> abc${foo}\'${bar}def
double quote    --> abc${foo}\"${bar}def
backtick        --> abc${foo}\`${bar}def
backspace       --> abc${foo}\\${bar}def

-- regular characters but escaped

\a
\c
\d
\e
\g
`;
