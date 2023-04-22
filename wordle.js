const wordlist = ["apple","paper","melon","zebra","books","cheap"]


let userAttempts = []
let answer = wordlist[0]


function startgame(round) {
    let attempt = 1
    while(attempt <= round){
        let userInput = prompt("guess a five letter word")
        // 1.check if word is in wordlist
        if(validateInput(userInput)){
            console.log(userInput)
            attempt = attempt + 1
        }else{
            retry(userInput)
        }
    }
}

function validateInput(word){
    return wordlist.includes(word)
}

function retry(word){
    alert(`${word} is not in word list`)
}

startgame(2)