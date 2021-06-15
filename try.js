let s = "hAck3rr4nk"
let pass = s.split('')
console.log("before", pass)
let abjad = /[a-zA-Z0-9]/i
let nmber = []
let passNew = [...pass]
for (let i = 0; i < pass.length; i++) {
    let a = i + 1
    if (a < pass.length && abjad.test(pass[i])) {
        // console.log(abjad.test(pass[i]), pass[i],isNaN(pass[i]))

        if (!isNaN(pass[i])) {
            // console.log(pass[i])
            nmber.unshift(pass[i])
            // pass.splice(0, 0, pass[i])
            passNew[i] = 0
        } else if (pass[i] == pass[i].toLowerCase() && pass[i + 1] == pass[i + 1].toUpperCase() && isNaN(pass[i])) {
            passNew.splice(i + 2, 0, '*')
            [passNew[i], passNew[i + 1]] = [passNew[i + 1], passNew[i]]
        }
    }
}
console.log("after", [...nmber, ...passNew])

// console.log(abjad.test('*'))