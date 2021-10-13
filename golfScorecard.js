

// Get access to each row in the table so we can update the numbers. 
getTheRows();


/*****/


// Get access to each row in the table so we can update the numbers. 
function getTheRows() {
    // Initialize array of rows
    let tablerows =[];
    // Get all the rows in the array
    for(let i=1; i<=18; i++ )
    {
        // Get row
        let row = document.getElementById(i);
        
        // Get last column in row
        let lastColumn = row.children[4];

        // Get plus button in last column
        let plusButton = lastColumn.children[0];
        plusButton.onclick = function(){
            addOne(row);
        }

        // Get minus button in last column
        let minusButton = lastColumn.children[1];
        minusButton.onclick = function(){
            minusOne(row);
        }
        console.log(i, plusButton, minusButton);

        // Add row to array
        tablerows.push(row);
    }
}


// add one to the score in row
function addOne(row){
    console.log('addOne');

    // Get score box. 
    let scoreBox = row.children[2];
    // Get over box. 
    let overBox = row.children[3];

    // If score value is null, then set new score to 1. 
    if(scoreBox.innerHTML == '-') {
        console.log('we got -');
        scoreBox.innerHTML = 1;
    }

    // If score value is a number, add 1 to that number. 
    else {
        // Get current score value 
        let scoreValue = scoreBox.innerHTML;
        console.log('we got',scoreValue);
        
        // Increment score value
        scoreValue++;
        let overValue = scoreValue-4;

        // Show new value on page
        scoreBox.innerHTML = scoreValue;
        if(overValue>=0) overBox.innerHTML = overValue;
    }

    // Update total
    updateTotal();
}



// Subtract one to the score in row
function minusOne(row){
    console.log('minusOne');

    // Get score box. 
    let scoreBox = row.children[2];
    // Get over box. 
    let overBox = row.children[3];

    // If score value is null, then set new score to -1. 
    if(scoreBox.innerHTML == '-') {
        console.log('we got -');
        scoreBox.innerHTML = -1;
    }

    // If score value is a number, minus 1 from that number. 
    else {
        // Get current score value 
        let scoreValue = scoreBox.innerHTML;
        console.log('we got',scoreValue);
        
        // decrement score value
        scoreValue--;
        let overValue = scoreValue-4;

        // Show new value on page
        scoreBox.innerHTML = scoreValue;
        if(overValue>=0) overBox.innerHTML = overValue;
    }

    // Update total
    updateTotal();
}




// Update total
function updateTotal() {
    // Get totals row
    let totalsRow = document.getElementById(19);

    // Initialize the totals to zero 
    let totalPar = 0;
    let totalScore = 0;
    let totalOver = 0;

    // Accumulate the totals
    for(let i=1 ; i<=18 ; i++) {
        // Get score
        let scoreValue = scoreBox.innerHTML;
        // Get over
        let overValue = overBox.innerHTML;

        // Add par
        totalPar += 4;
        // Add score
        totalScore += scoreValue;
        // Add over
        totalOver += overValue;
    }
    console.log('totalPar',totalPar);
    console.log('totalScore',totalScore);
    console.log('totalOver',totalOver);
}
