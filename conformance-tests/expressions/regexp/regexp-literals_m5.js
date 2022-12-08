const reg1 = /\\(?![{}()+?.^$])/g
const reg2 = /(\/|\\(?!\.))/g
const reg3 = /\s*at.*\(?(:\d*:\d*|native)\)?/
const reg4 = /(\r\n|\n|\r)/gm
const reg5 = /^Symbol\((.*)\)(.*)$/
const reg6 = /jest/
const reg7 = /^(HTML\w*Collection|NodeList)$/
const reg8 = /[\u001b\u009b]\[\d{1,2}m/gu
const reg9 = /^((HTML|SVG)\w*)?Element$/
const reg10 = /[^.[\\]]+|(?=(?:\\.)(?:\\.|$))/g
const reg11 = /^you are using the wrong JDK$/
