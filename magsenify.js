fs = require("fs")

if (process.argv.length < 3) {
    console.log(`error: mgn file required to magsenify your text
i.e.: node magsenify.js arial.mgn "Magsen will rise"`)
    return
}

if (process.argv.length < 4) {
    console.log(`error: text argument required or else there will be nothing to magsenify
i.e.: node magsenify.js arial.mgn "Magsen will rule"`)
    return
}


const mgnData = fs.readFileSync(process.argv[2], 'utf8').split("\n")
const mgnSpec = JSON.parse(mgnData[0])
const mgnFont = mgnData.slice(1)

function getLetterStart(letter) {
    const charCode = letter.charCodeAt(0)
    let letterIndex = charCode
    if (letterIndex >= 'a'.charCodeAt(0) && letterIndex <= 'z'.charCodeAt(0)) {
        letterIndex -= 'a'.charCodeAt(0)
    } else if (letterIndex >= 'A'.charCodeAt(0) && letterIndex <= 'Z'.charCodeAt(0)) {
        letterIndex -= 'A'.charCodeAt(0)
    } else {
        return -1
    }
    return (mgnSpec.height + mgnSpec.separator) * letterIndex
}

function printString(string) {
    const letterStartCollection = []
    for (const letter of string) {
        letterStartCollection.push(getLetterStart(letter))
    }
    for (let i = 0; i < mgnSpec.height; ++i) {
        for (const letterStart of letterStartCollection) {
            if (letterStart === -1) { // space or something weird
                process.stdout.write(':nogsen:'.repeat(mgnSpec.width))
            } else {
                process.stdout.write(mgnFont[letterStart + i].replace(/#/g, ':magsen:').replace(/ /g, ':nogsen:'))
            }
        }
        process.stdout.write("\n")
    }
}

printString(process.argv[3])
