let y = "apple"
let x = y.split("")
// x

// push

x.push("s")

console.log(x)

let uppercaseApple = []
for (let index = 0; index < 6; index++) {
   uppercaseApple.push(x[index].toUpperCase())
}

console.log(uppercaseApple)

let newUpperCaseApple = []
x.forEach((item)=> newUpperCaseApple.push(item.toUpperCase()))
newUpperCaseApple