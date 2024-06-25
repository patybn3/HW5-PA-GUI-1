/** 
 * @author Patricia Antlitz
 * @version 1.0
*/

var pieces = [
    {"letter":"A", "value":1,  "amount":9},
    {"letter":"B", "value":3,  "amount":2},
    {"letter":"C", "value":3,  "amount":2},
    {"letter":"D", "value":2,  "amount":4},
    {"letter":"E", "value":1,  "amount":12},
    {"letter":"F", "value":4,  "amount":2},
    {"letter":"G", "value":2,  "amount":3},
    {"letter":"H", "value":4,  "amount":2},
    {"letter":"I", "value":1,  "amount":9},
    {"letter":"J", "value":8,  "amount":1},
    {"letter":"K", "value":5,  "amount":1},
    {"letter":"L", "value":1,  "amount":4},
    {"letter":"M", "value":3,  "amount":2},
    {"letter":"N", "value":1,  "amount":6},
    {"letter":"O", "value":1,  "amount":8},
    {"letter":"P", "value":3,  "amount":2},
    {"letter":"Q", "value":10, "amount":1},
    {"letter":"R", "value":1,  "amount":6},
    {"letter":"S", "value":1,  "amount":4},
    {"letter":"T", "value":1,  "amount":6},
    {"letter":"U", "value":1,  "amount":4},
    {"letter":"V", "value":4,  "amount":2},
    {"letter":"W", "value":4,  "amount":2},
    {"letter":"X", "value":8,  "amount":1},
    {"letter":"Y", "value":4,  "amount":2},
    {"letter":"Z", "value":10, "amount":1},
    {"letter":"_", "value":0,  "amount":2}
  ];
  
  var tiles = [
    {"id": "piece0", "letter": "A"},
    {"id": "piece1", "letter": "B"},
    {"id": "piece2", "letter": "C"},
    {"id": "piece3", "letter": "D"},
    {"id": "piece4", "letter": "E"},
    {"id": "piece5", "letter": "F"},
    {"id": "piece6", "letter": "G"}
  ]
  
  var board = [
    {"id": "drop0",  "tile": "pieceX"},
    {"id": "drop1",  "tile": "pieceX"},
    {"id": "drop2",  "tile": "pieceX"},
    {"id": "drop3",  "tile": "pieceX"},
    {"id": "drop4",  "tile": "pieceX"},
    {"id": "drop5",  "tile": "pieceX"},
    {"id": "drop6",  "tile": "pieceX"},
    {"id": "drop7",  "tile": "pieceX"},
    {"id": "drop8",  "tile": "pieceX"},
    {"id": "drop9",  "tile": "pieceX"},
    {"id": "drop10", "tile": "pieceX"},
    {"id": "drop11", "tile": "pieceX"},
    {"id": "drop12", "tile": "pieceX"},
    {"id": "drop13", "tile": "pieceX"},
    {"id": "drop14", "tile": "pieceX"}
  ]

// script.js
$(document).ready(function () {
    let score = 0;
    let totalScore = 0;
    let droppedTiles = [];
    let submittedWords = [];
    let validWords = 0;
    let invalidWords = 0;

    function initializeGame() {
        createTileRack();
        updateScore();
        resetValidationMessage();
        updateSubmittedWordsTable();
        updateGameSummaryTable();
    }

    function createTileRack() {
        const rackTiles = $("#rackTiles");
        rackTiles.empty();

        for (let i = 0; i < 7; i++) {
            const tile = getRandomTile();
            const tileElement = $('<div>')
                .addClass('tile')
                .css('background-image', `url(graphics_data/Scrabble_Tiles/Scrabble_Tile_${tile.letter}.jpg)`)
                .data('letter', tile.letter)
                .data('value', tile.value)
                .draggable({
                    revert: "invalid",
                    stack: '.tile',
                    cursor: 'move',
                    helper: 'clone'
                });
            rackTiles.append(tileElement);
        }
    }

    function getRandomTile() {
        const letters = Object.keys(ScrabbleTiles);
        let randomLetter;

        do {
            randomLetter = letters[Math.floor(Math.random() * letters.length)];
        } while (ScrabbleTiles[randomLetter]["number-remaining"] === 0);

        ScrabbleTiles[randomLetter]["number-remaining"]--;
        return { letter: randomLetter, value: ScrabbleTiles[randomLetter].value };
    }

    // Dropping tile onto the board
    $(".board").droppable({
        accept: ".tile",
        drop: function (event, ui) {
            const draggable = ui.helper.clone().draggable({
                revert: "invalid",
                stack: '.tile',
                cursor: 'move'
            });
            $(this).append(draggable);

            const letter = draggable.data('letter');
            const value = draggable.data('value');

            droppedTiles.push({ letter, value });
            updateScore();
        }
    });

    function calculateScore() {
        let wordScore = 0;
        droppedTiles.forEach(tile => {
            wordScore += tile.value;
        });
        return wordScore;
    }

    function updateScore() {
        score = calculateScore();
        $("#score").text(score);
    }

    function validateWord(word) {
        // Use a more comprehensive dictionary or a placeholder function
        const dictionary = ["apple", "banana", "cat", "dog", "elephant", "frog", "goat", "hippo", "ice", "juice", "joy"]; // Example words
        return dictionary.includes(word.toLowerCase());
    }

    function handleWordSubmission() {
        const word = droppedTiles.map(tile => tile.letter).join('');
        const isValid = validateWord(word);
        const wordScore = calculateScore();

        $("#validationMessage").text(isValid ? "Valid Word" : "Invalid Word");

        submittedWords.push({ word, isValid, score: wordScore });
        updateSubmittedWordsTable();

        if (isValid) {
            validWords++;
            totalScore += wordScore;
        } else {
            invalidWords++;
        }

        updateGameSummaryTable();
        clearBoard();
        createTileRack();
    }

    function updateSubmittedWordsTable() {
        const tableBody = $("#submittedWords");
        tableBody.empty();

        submittedWords.forEach(entry => {
            const row = $("<tr>");
            row.append($("<td>").text(entry.word));
            row.append($("<td>").text(entry.isValid ? "Yes" : "No"));
            row.append($("<td>").text(entry.score));
            tableBody.append(row);
        });
    }

    function updateGameSummaryTable() {
        const summaryBody = $("#gameSummary");
        summaryBody.empty();

        const row = $("<tr>");
        row.append($("<td>").text(validWords));
        row.append($("<td>").text(invalidWords));
        row.append($("<td>").text(totalScore));
        summaryBody.append(row);
    }

    function clearBoard() {
        droppedTiles = [];
        $(".board .tile").remove();
        updateScore();
        resetValidationMessage();
    }

    function resetValidationMessage() {
        $("#validationMessage").text('');
    }

    $("#submitWord").click(handleWordSubmission);

    $("#resetBoard").click(function () {
        clearBoard();
        submittedWords = [];
        validWords = 0;
        invalidWords = 0;
        totalScore = 0;
        createTileRack();
        updateSubmittedWordsTable();
        updateGameSummaryTable();
    });

    $("#newTiles").click(createTileRack);

    initializeGame();
});

