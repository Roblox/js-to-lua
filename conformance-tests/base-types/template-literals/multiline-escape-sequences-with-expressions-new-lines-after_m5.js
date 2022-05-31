const value = `
backspace       --> abc${foo}\b${bar}
form feed       --> abc${foo}\f${bar}
new line        --> abc${foo}\n${bar}
carriage return   --> abc${foo}\r${bar}
horizontal tab  --> abc${foo}\t${bar}
vertical tab    --> abc${foo}\v${bar}
zero            --> abc${foo}\0${bar}
single quote    --> abc${foo}\'${bar}
double quote    --> abc${foo}\"${bar}
backtick        --> abc${foo}\`${bar}
backspace       --> abc${foo}\\${bar}

-- regular characters but escaped

\a
\c
\d
\e
\g
`;
