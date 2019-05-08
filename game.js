    //var context = canvas.getContext("2d");
    var shape = new Object();
    var board;
    var ghostBoard;
    var score;
    var pac_color;
    var start_time;
    var time_elapsed;
    var interval;
    var direction;
    var numOfMons;
    var monsArr;
    var life;
    var isArrows=true;
    var img = new Image();
    img.src = 'mon.png';
    var img1 = new Image();
    img1.src = 'mon1.png';
    var img2 = new Image();
    img2.src = 'mon2.png';
    Start();

    function Start() {
        playMusic();
        numOfMons=1;//need to edit by the user
        monsArr = new Array (numOfMons);
        for (var i=0; i<numOfMons; i++)
        {
            monsArr[i] = new Object();
            monsArr[i].canSee=false;
        }
        
        direction=4;
        board = new Array();
        ghostBoard = new Array();
        score = 0;
        life=3;
        pac_color = "yellow";
        var cnt = 100;
        var food_remain = 50;
        var pacman_remain = 1;
        start_time = new Date();
        for (var i = 0; i < 10; i++) {
            board[i] = new Array();
            ghostBoard[i] = new Array();
            //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
            for (var j = 0; j < 10; j++) {
                if ((i === 3 && j === 3) || (i === 3 && j === 4) || (i === 3 && j === 5) || (i === 6 && j === 1) || (i === 6 && j === 2)) {
                    board[i][j] = 4;
                } else {
                    var randomNum = Math.random();
                    if (randomNum <= 1.0 * food_remain / cnt) {
                        food_remain--;
                        board[i][j] = 1;
                    } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                        shape.i = i;
                        shape.j = j;
                        pacman_remain--;
                        board[i][j] = 2;
                    } else {
                        board[i][j] = 0;
                    }
                    cnt--;
                }
            }
        }
        initGhosts();
        while (food_remain > 0) {
            var emptyCell = findRandomEmptyCell(board);
            board[emptyCell[0]][emptyCell[1]] = 1;
            food_remain--;
        }
        keysDown = {};
        addEventListener("keydown", function (e) {
            keysDown[e.code] = true;
        }, false);
        addEventListener("keyup", function (e) {
            keysDown[e.code] = false;
        }, false);
        interval = setInterval(UpdatePosition, 150);
        intervalGhost = setInterval(moveExample, 600);
    }



    function moveExample()
    {
        for (var idx=0; idx<numOfMons; idx++)
        {
            if (board[monsArr[idx].i/60][monsArr[idx].j/60]==2)
                eatPacman();
            var rand = Math.random();
            //id they're not next to walls or the boarders
            var flag=false;

            if (board[monsArr[idx].i/60+1][monsArr[idx].j/60]!=4 &&
                board[monsArr[idx].i/60-1][monsArr[idx].j/60]!=4 &&
                board[monsArr[idx].i/60][monsArr[idx].j/60+1]!=4 && 
                board[monsArr[idx].i/60][monsArr[idx].j/60-1]!=4)
            {
                flag=true;
                if (monsArr[idx].i/60==shape.i) //same row
                {
                    if (monsArr[idx].j/60>shape.j)
                        monsArr[idx].j-=60;
                    if (monsArr[idx].j/60<shape.j)
                        monsArr[idx].j+=60;
                }
                else if (monsArr[idx].j/60==shape.j) //same col
                {
                    if (monsArr[idx].i/60>shape.i)
                        monsArr[idx].i-=60;
                    if (monsArr[idx].i/60<shape.i)
                        monsArr[idx].i+=60;
                }
                //if random <0.5, move the rows in the correct direction, else move the column in the correct direction
                else
                {
                    flag=true;
                    if (monsArr[idx].i/60<shape.i)
                    {
                        if (rand<0.5)
                            monsArr[idx].i+=60;
                    }
                    if (monsArr[idx].i/60>shape.i)
                    {
                        if (rand<0.5)
                            monsArr[idx].i-=60;
                    }

                    if (monsArr[idx].j/60<shape.j)
                    {
                        
                        if (rand>=0.5)
                            monsArr[idx].j+=60;
                    }
                    if (monsArr[idx].j/60>shape.j)
                    {
                        if (rand>=0.5)
                            monsArr[idx].j-=60;
                    }
                }
                }
                else
                {
                    if (board[monsArr[idx].i/60-1][monsArr[idx].j/60]==4 &&
                board[monsArr[idx].i/60][monsArr[idx].j/60+1]!=4 && 
                board[monsArr[idx].i/60][monsArr[idx].j/60-1]!=4)
                {

                }
                }
                
        }

        var currX=monsArr[idx].j/60;
        var currY=monsArr[idx].i/60;
        if (idx==0)
            ghostBoard[currY][currX]=51;
        if (idx==1)
            ghostBoard[currY][currX]=52;
        if (idx==2)
            ghostBoard[currY][currX]=53;
    
    }


    //function rebuildGame(){}


    function initGhosts()
    {
        monsArr[0].i = 60;
        monsArr[0].j = 60;
        ghostBoard[1][1]=51;

        if(numOfMons >= 2) {
        monsArr[1].i = 480;
        monsArr[1].j = 60;
        ghostBoard[8][1]=52;
        }

        if(numOfMons >= 3) {
        monsArr[2].i = 60;
        monsArr[2].j = 480;
        ghostBoard[1][8]=53;
        }
    
}

    function findRandomEmptyCell(board) {
        var i = Math.floor((Math.random() * 9) + 1);
        var j = Math.floor((Math.random() * 9) + 1);
        while (board[i][j] !== 0) {
            i = Math.floor((Math.random() * 9) + 1);
            j = Math.floor((Math.random() * 9) + 1);
        }
        return [i, j];
    }

    /**
     * @return {number}
     */
    function GetKeyPressed()
    {
        if (isArrows)
        {
        if (keysDown['ArrowUp']) {
            return 1;
        }
        if (keysDown['ArrowDown']) {
            return 2;
        }
        if (keysDown['ArrowLeft']) {
            return 3;
        }
        if (keysDown['ArrowRight']) {
            return 4;
        }
        }
    }

    function eatPacman()
    {
        life--;
        score-=10;
        if (life==0)
        {
            window.clearInterval(interval);
            window.alert("your score is:"+score+"Game over");
        }
        else
        {
            initGhosts();
            var newPacman = findRandomEmptyCell(board);
            board[shape.i][shape.j]=0;
            board[newPacman[0]][newPacman[1]] = 2;
            shape.i=newPacman[0];
            shape.j=newPacman[1];
        }
    }

    function Draw() {
        context.clearRect(0, 0, canvas.width, canvas.height); //clean board
        lblScore.value = score;
        lblTime.value = time_elapsed;
        lblLife.value = life;
        var startDraw;
        var endDraw;
        var circleX;
        var circleY;
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var center = new Object();
                center.x = i * 60 + 30;
                center.y = j * 60 + 30;
                if (ghostBoard[i][j] === 51) {
                    context.drawImage(img, monsArr[0].i, monsArr[0].j, 60, 60);
                }
                if (ghostBoard[i][j] === 52) {
                    context.drawImage(img1, monsArr[1].i, monsArr[1].j, 60, 60);
                }
                if (ghostBoard[i][j] === 53) {
                    context.drawImage(img2, monsArr[2].i, monsArr[2].j, 60, 60);
                }
                if (board[i][j] === 2) {
                    
                    switch (direction) {
                    case 1:
                    startHalf = 1.65;
                    endHalf = 1.35;
                    circleX = -15;
                    circleY = -5;
                    break;
                    case 2:
                    startHalf = 0.65;
                    endHalf = 0.35;
                    circleX = 15;
                    circleY = -5;
                    break;
                    case 3:
                    startHalf = 1.15;
                    endHalf = 0.85;
                    circleX = -5;
                    circleY = -15;
                    break;
                    case 4:
                    startHalf = 0.15;
                    endHalf = 1.85;
                    circleX = 5;
                    circleY = -15;
                    break;
                    }
                    context.beginPath();
                    context.arc(center.x, center.y, 30, startHalf* Math.PI, endHalf * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + circleX, center.y + circleY, 5, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (board[i][j] === 1) {
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0, 2 * Math.PI);
                    context.fillStyle = "black"; //color
                    context.fill();
                } else if (board[i][j] === 4) {
                    context.beginPath();
                    context.rect(center.x - 30, center.y - 30, 60, 60);
                    context.fillStyle = "grey"; //color
                    context.fill();
                }
            }
        }


    }

    function playMusic() {
    soundtrack.load();
    soundtrack.play();
}

    function UpdatePosition() {
        board[shape.i][shape.j] = 0;
        var x = GetKeyPressed();
        if (x)
        direction=x;
        if (x === 1) {
            if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
                shape.j--;
            }
        }
        if (x === 2) {
            if (shape.j < 9 && board[shape.i][shape.j + 1] !== 4) {
                shape.j++;
            }
        }
        if (x === 3) {
            if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
                shape.i--;
            }
        }
        if (x === 4) {
            if (shape.i < 9 && board[shape.i + 1][shape.j] !== 4) {
                shape.i++;
            }
        }
        if (board[shape.i][shape.j] === 1) {
            score++;
        }
        

        board[shape.i][shape.j] = 2;
        var currentTime = new Date();
        time_elapsed = (currentTime - start_time) / 1000;
        //if ()
        if (score === 50) {
            window.clearInterval(interval);
            window.alert("Game completed");
        } else {
            Draw();
        }    
    }