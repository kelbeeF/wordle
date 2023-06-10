/** Wait for Content to load */
document.addEventListener("DOMContentLoaded", () => {

    // TODO: a global constant to reference the TILES on the board
    const TILES = Array.from(document.querySelectorAll(".tile"));
    const BOARD = document.querySelector("#board");
    const ROWS = BOARD.querySelectorAll(".row");
    const KEYBOARD = document.querySelector("#keyboard");
    const KEYBOARD_KEYS = KEYBOARD.querySelectorAll("button");
    /** Start the whole game (Student) */
    function startWebGame() {
        // TODO: what should the game logic be?
        GameState.loadOrStartGameState();
        paintGameState();
        startInteraction();
    }
 
    /** Bind events */  
    function startInteraction() {
        const keyboardElement = document.getElementById("keyboard");
        keyboardElement.addEventListener("click", handleClickEvent);
        document.addEventListener("keydown", handlePressEvent);
    }

    /** Unbind events during animation */
    function stopInteraction() {
        const keyboardElement = document.getElementById("keyboard");
        keyboardElement.removeEventListener("click", handleClickEvent);
        document.removeEventListener("keydown", handlePressEvent);
    }

    /** Button click events on the keyboard elements */
    function handleClickEvent(event) {
        const button = event.target;
        if (!(button instanceof HTMLButtonElement)) {
            return;
        }
        let key = button.dataset.key;
        if (!key) {
            return;
        }
        pressKey(key);
    }

    /** Keyboard press events on the document */
    function handlePressEvent(event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
            return;
        }
        const key = event.key;
        pressKey(key);
    }

    /** Handle keypress (Student) */
    function pressKey(key) {
        const status = GameState.getStatus()

        if(status !== "in-progress"){
            return;
        }


        console.log(key);
        // TODO: get current guess from state and the next tile index to update
        let next = TILES.findIndex((tile)=> tile.innerText === "")
        if(next ===-1){
            next = WORD_LENGTH * MAX_ATTEMPTS;
        }

        const regex = new RegExp("^[a-zA-Z]$");
        const currentGuess = GameState.getCurrentGuess();

        if (regex.test(key)) {
            handleKey(currentGuess, key, next);
        } else if (key === "Backspace" || key === "Delete") {
            handleDelete(currentGuess, next);
        } else if (key === "Enter") {
            handleSubmit(currentGuess, next);
        }
    }

    /** Handle a valid keypress (Student) */
    function handleKey(currentGuess, key, next) {
        if(currentGuess.length === WORD_LENGTH){
            return;
        }
        // TODO: update the tile
        const nextTile = TILES[next];
        nextTile.textContent = key;
        nextTile.dataset["status"] = "tbd";
        nextTile.dataset["animation"] = "pop"
        // TODO: pop animation
        GameState.setUserAttempt(currentGuess + key);
    }

    /** Handle delete (Student) */
    function handleDelete(currentGuess, next) {
        if(currentGuess.length === 0){
            return;
        }
        // TODO: remove character on tile
        const previnousTile = TILES[next - 1];
        previnousTile.textContent = "";
        previnousTile.dataset["status"] = "empty";
        previnousTile.dataset["animation"] = "";

        GameState.setUserAttempt(
            currentGuess.slice(0, currentGuess.length - 1)
        );
    }

    /** Handle Submit (Student) */
    async function handleSubmit(currentGuess) {
        // TODO: Submit guess
        if (currentGuess.length < WORD_LENGTH){
            return;
        }

        const answer = GameState.getAnswer();
        const oldKeyboard = GameState.getKeyboard();
        const attempt = GameState.getAttempt();

        if(isInputCorrect(currentGuess)){
            const highlightedCharacters = checkCharacters(currentGuess, answer);
            
            GameState.setHighlightedRows(highlightedCharacters);

            const newKeyboard = updateKeyboardHighlights(
                oldKeyboard,
                currentGuess,
                highlightedCharacters
            );
            GameState.setKeyboard(newKeyboard);
            //highlightedKeyboard(keyboard)
            await paintAttempt(attempt, highlightedCharacters, newKeyboard);
            const newStatus = updateGameStatus(
                currentGuess,
                answer,
                attempt,
                MAX_ATTEMPTS - 1,
            );
            GameState.setStatus(newStatus);
            await paintResult(newStatus, attempt, answer);

            GameState.incrementAttempt();
            GameState.saveGameState();

        }else{
            shakeRow(currentGuess, attempt);
        }
    }

    /** Painting One Attempt */
    async function paintAttempt(attempt, highlightedCharacters, highlightedKeyboard) {
        stopInteraction();
        await paintRow(attempt, highlightedCharacters);
        await paintKeyboard(highlightedKeyboard);
        startInteraction();
    }

    /** Painting a row on the board (Partially student) */
    async function paintRow(index, evaluation) {
        const updateGameStatus = GameState.getStatus()

        const startTile = index * WORD_LENGTH// TODO: get the starting index of the TILES
        const endTile = startTile + WORD_LENGTH// TODO: get the ending index of the TILES 

        return new Promise(resolve => {
            for (let i = startTile; i < endTile; i++) {
                // TODO: change index to 0 to 4 to be used for indexing and timing
                const charIndex = i % WORD_LENGTH;
                const status = evaluation[charIndex];
                TILES[i].dataset.animation = "flip";
                TILES[i].style.animationDelay = `${charIndex * 500}ms`;
                TILES[i].onanimationstart = () => {
                    setTimeout(()=>{
                        TILES[i].dataset.status = status;
                    }, 250);
                }
                /** Student */
                // TODO: flip animation 
                // this is the last tile of the row
                if (i === endTile - 1) {
                    TILES[i].onanimationend = resolve;
                }
            }
        });
    }
    async function paintResult(newStatus, attempt, answer){
        if (newStatus === "in-progress"){
            return;
        }
        if(newStatus === "success"){
            handleSuccessAnimation(attempt)
        }else {
            alert(`The word was ${answer.toUpperCase()}`)
        }
    }


    /** When game ends and status is success (Student) */
    function handleSuccessAnimation(attempt) {
        const tiles = ROWS[attempt].querySelectorAll(".tile");
        tiles.forEach((tile, index) =>{
            tile.dataset.animation = "win";
            tile.style.animationDelay = `${index * 100}ms`;

            if (index === WORD_LENGTH - 1){
                tile.onanimationend = () => {
                    alert(`${CONGRATULATIONS[attempt]}!!!`)
                }
            }
        });
    }

    function shakeRow(currentGuess, attempt){
        stopInteraction();

        alert(`${currentGuess.toUpperCase()} not in word list`);
        ROWS[attempt].dataset.status = "invalid";
        ROWS[attempt].onanimationend = () => {
            startInteraction();
            ROWS[attempt].removeAttribute("data-status");
        };
    }

    /** Painting keyboard update (Student) */
    function paintKeyboard(keyboard) {
        // TODO: paint keyboard given highlights
        console.log(keyboard)
        KEYBOARD_KEYS.forEach(button => {
            const key = button.dataset.key;
            const newStatus = keyboard[key];
            button.dataset.status = newStatus;
        })
    }

    /** Painting a whole Game State (Student) */
    function paintGameState() {
        // TODO: paint the tiles and keyboard at once
        const gameAttempt = GameState.getAttempt();
        const keyboardHighlights = GameState.getKeyboard();
        const userAttempts = GameState.getUserAttempts();
        const highlightedCharacters = GameState.getHighlightedRows();
        if (gameAttempt === 0){
            return;
        }
        paintKeyboard(keyboardHighlights);
        userAttempts.forEach((word, index) => {
            const row = ROWS[index]
            const tiles = row.querySelectorAll(".tile")
            const characters = word.split("");
            characters.forEach((char, i) =>{
                tiles[i].textContent = char;
                tiles[i].dataset.status = "tbd";
            });
        });
        const highlightedRows = GameState.getHighlightedRows();

        for(let i=0; i < gameAttempt; i++){
            paintRow(i, highlightedRows[i]);
        };

    };

    startWebGame();

});
