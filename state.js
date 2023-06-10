/** Game State (Student) */
const GameState = {
    userAttempts : [],
    highlightedRows : [],
    keyboard : getKeyboard(),
    attempt : 0,
    status : "in-progress",
    getAttempt(){
        return this.attempt;
    },

    incrementAttempt(){
        this.attempt = this.attempt + 1;
        return this.attempt;
    
    },
    getUserAttempts(){
        return this.userAttempts;
    },

    setUserAttempt(currentGuess){
        this.userAttempts[this.attempt] = currentGuess
        return this.userAttempt
    },
    getCurrentGuess(){
        let currentGuess = this.userAttempts[this.attempt];
        if (currentGuess === undefined){
            return "";
        }
        return currentGuess;
    },
    getAnswer(){
        return this.answer;
    },
    setHighlightedRows(highlightedCharacters){
        this.highlightedRows.push(highlightedCharacters);
        return this.highlightedRows;
    },
    getHighlightedRows(){
        return this.highlightedRows;
    },
    setKeyboard(newKeyboard){
        this.keyboard = newKeyboard;
        return newKeyboard;
    },
    getKeyboard(){
        return this.keyboard;
    },
    setStatus(newStatus){
        this.status = newStatus;
        return newStatus;
    },
    getStatus(){
        return this.status;
    },
    saveGameState(){
        saveGame({
            attempt: this.attempt,
            keyboard: this.keyboard,
            userAttempts: this.userAttempts,
            highlightedRows: this.highlightedRows,
            status: this.status,
            timeStamp: new Date().getTime(),
        })
    },
    async loadOrStartGameState(){
        const {
            attempt,
            keyboard,
            userAttempts,
            highlightedRows,
            status,
            answer,
        } = await loadOrStartGame();
        this.attempt = attempt;
        this.keyboard = keyboard;
        this.userAttempts = userAttempts;
        this.highlightedRows = highlightedRows;
        this.status = status;
        this.answer = answer;
        }
    
};

window.GameState = GameState;