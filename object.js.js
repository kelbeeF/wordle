const obj = {apple: "red"}
obj.apple

obj.banana = "yellow"
obj

for (const fruit in obj){
    console.log(fruit, obj[fruit])
}