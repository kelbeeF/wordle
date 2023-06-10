const testwordlist = ["apple",
                  "alley",
                  "paper",
                  "melon",
                  "zebra",
                  "books",
                  "cheap",
                  "aplex",
                  "right",
                  "since",
                  "fifty",
                  "fifth"];

let wordlist = {walid: [], playable: []};

const rating = {
    unknown : 0,
    absent : 1,
    present : 2,
    correct : 3
}; 

function startgame(round) {
    let{
        attempt,
        keyboard,
        userAttempts,
        highlightedRows,
        status,
        answer
    } = loadOrStartGame()
    // const userAttempts = []
    // const answer = wordlist[0]
    // const highlightedRows = []
    // let keyboard = getKeyboard()
    // let attempt = 1
    // let status = "in-progress"
    while(attempt <= round && status === "in-progress"){
        let userInput = prompt("guess a five letter word")
        // 1.check if word is in wordlist
        if(isInputCorrect(userInput)){
            console.log(userInput)
            userAttempts.push(userInput)
            attempt = attempt + 1
            const highlightedCharacters = checkCharacters(userInput, answer)
            highlightedRows.push(highlightedCharacters)
            console.log(highlightedCharacters)
            keyboard = updateKeyboardHighlights(keyboard, userInput, highlightedCharacters)
            //highlightedKeyboard(keyboard)
            console.log(keyboard)
            status = updateGameStatus(userInput, answer, attempt, round)
            console.log(status)
            saveGame({
                attempt,
                keyboard,
                userAttempts,
                highlightedRows,
                status
                
            })
        }else{
            retry(userInput)
        }
    }
}

function isInputCorrect(word){
    return wordlist.playable.includes(word)||wordlist.valid.includes(word);
}

function retry(word){
    alert(`${word} is not in word list`)
}


function checkCharacters(word, answer) {
    const wordSplit = word.split("")
    const result = []

    wordSplit.forEach((character, index)=>{
        if (character === answer[index]){
            result.push("correct")
        }else if(answer.includes(character)){
            result.push("present")
        }else{
            result.push("absent")
        }
    } )
   return result
 
}

function getKeyboard(){
    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("")
    const entries = []
    for(const alphabet of alphabets){
        entries.push([alphabet, "unknown"])
    }
    return Object.fromEntries(entries)
}

function updateKeyboardHighlights(keyboard, userInput, highlightedCharacter){

    const newKeyboard = Object.assign({}, keyboard)
    
    for(let i= 0; i< highlightedCharacter.length; i++){
        const character = userInput[i]  //R
        const nextStatus = highlightedCharacter[i]  //absent
        const previousStatus = newKeyboard[character] //unknown
        const previousRating = rating[previousStatus] // 0
        const nextRating = rating[nextStatus] //1

        if(nextRating > previousRating){
            newKeyboard[character] = nextStatus
        }
    }

    return newKeyboard
}

function updateGameStatus(userInput, answer, attempt, round){
    if(userInput===answer){
       return "success"
    }else if(attempt===round){
        return "fail"
    }else{
        return "in-progress"
    }

    
}

function saveGame(gameState){
    let s = JSON.stringify(gameState)
    window.localStorage.setItem("prefaceWordle", s)
}

function getTodaysAnswer(){
    const startDate = new Date(2023, 5,10).getTime();
    const now = new Date().getTime();
    const msOffset = now - startDate;
    const daysOffset = Math.floor(msOffset /1000/60/60/24);
    const answerIndex = daysOffset % wordlist.playable.length;
    return wordlist.playable[answerIndex];
}

function isToday(timestamp){
    const today = new Date()
    const source = new Date(timestamp);
    return today.toDateString() === source.toDateString();
}

async function loadOrStartGame(){
    wordlist = await fetch("./src/fixtures/words.json")
        .then(responce => {
            return responce.json();
        })
        .then(json => {
            return json;
        })
    let answer = getTodaysAnswer();
    const previousGameString = window.localStorage.getItem("prefaceWordle");
    const previousGame = JSON.parse(previousGameString);
    
    if (previousGame && isToday(previousGame.timeStamp)){
        return {
            ...previousGame,
            answer
        }
    }
    const userAttempts = []
    const highlightedRows = []
    let keyboard = getKeyboard()
    let attempt = 0
    let status = "in-progress"

    return{
        attempt,
        keyboard,
        userAttempts,
        highlightedRows,
        status,
        answer
    }
}

