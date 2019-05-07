
var user;
var dictionary;
var shape = new Object();
    var bonus=new Object();
    var board;
    var ghostBoard;
    var score;
    var pac_color;
    var start_time;
    var time_elapsed;
    var time_remain;
    var interval;
    var direction;
    var numOfMons;
    var monsArr;
    var life;
    var seconds;
    var isArrows=true;
    var img = new Image();
    img.src = 'mon.png';
    var img1 = new Image();
    img1.src = 'mon1.png';
    var img2 = new Image();
    img2.src = 'mon2.png';
    var clocky = new Image();
    clocky.src = 'time.png';
    var gift = new Image();
    gift.src = 'present.png';
    var context = canvas.getContext("2d");

    function Start() {
        
        
        seconds=60;//need to edit by the user
        numOfMons=3;//need to edit by the user
      
        monsArr = new Array (numOfMons);
        
        for (var i=0; i<numOfMons; i++)
        {
            monsArr[i] = new Object();
        }
        
        direction=4;
        board = new Array();
        ghostBoard = new Array();
        score = 0;
        life=3;
        pac_color = "yellow";
        var cnt = 100;
        var food_remain = 50;
        var food_5_remain = Math.floor(food_remain*0.6);
        var food_15_remain = Math.floor(food_remain*0.3);
        var food_25_remain = Math.floor(food_remain*0.1);
        var allFood = food_5_remain+food_15_remain+food_25_remain;
        food_remain = allFood;
        var pacman_remain = 1;
        start_time = new Date();
        
        for (var i = 0; i < 11; i++) {
            board[i] = new Array();
            ghostBoard[i] = new Array();
            //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
            for (var j = 0; j < 10; j++) {
                
                if ((i === 2 && j === 1) || (i === 1 && j === 2) || (i === 2 && j === 2) || (i === 4 && j === 1) || (i === 5 && j === 1)|| (i === 6 && j === 1)|| (i === 8 && j === 1)|| (i === 8 && j === 2)|| (i === 9 && j === 2)|| (i === 5 && j === 2)||
                (i === 2 && j === 8) || (i === 1 && j === 7) || (i === 2 && j === 7) || (i === 4 && j === 8) || (i === 5 && j === 8)|| (i === 6 && j === 8)|| (i === 8 && j === 8)|| (i === 8 && j === 7)|| (i === 9 && j === 7)|| (i === 5 && j === 7)) 
                {    
                    board[i][j] = 4;
                } 
                else {
                    var randomNum = Math.random();
                    if (randomNum <= 1.0 * food_remain / cnt) {
                        food_remain--;
                        if (randomNum<=0.4)
                        {
                        if (randomNum<=0.1 && food_25_remain>0)
                        {
                            food_25_remain--;
                            food_remain--;
                            board[i][j] = 25;
                        }
                        if (randomNum>0.1 && randomNum<=0.4 && food_15_remain>0)
                        {
                            food_15_remain--;
                            food_remain--;
                            board[i][j] = 15;
                        }
                    }
                        else
                        {
                            food_5_remain--;
                            food_remain--;
                            board[i][j] = 5;
                        }
                        
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
        
        while (food_5_remain > 0) {
            var emptyCell = findRandomEmptyCell(board);
            board[emptyCell[0]][emptyCell[1]] = 5;
            food_5_remain--;
            food_remain--;
        }
        while (food_15_remain > 0) {
            var emptyCell = findRandomEmptyCell(board);
            board[emptyCell[0]][emptyCell[1]] = 15;
            food_15_remain--;
            food_remain--;
        }
        while (food_25_remain > 0) {
            var emptyCell = findRandomEmptyCell(board);
            board[emptyCell[0]][emptyCell[1]] = 25;
            food_25_remain--;
            food_remain--;
        }
        keysDown = {};
        addEventListener("keydown", function (e) {
            keysDown[e.code] = true;
        }, false);
        addEventListener("keyup", function (e) {
            keysDown[e.code] = false;
        }, false);
        
        intervalEat = setInterval(eatPacman, 150);
        interval = setInterval(UpdatePosition, 150);
        intervalEatBonus = setInterval(eatBonus, 150);
        intervalGift = setInterval(bonusMove, 600);
        if (score<50)
            intervalGhost = setInterval(moveGhosts, 600);
        if (score>=50 && score<75)
            intervalGhost = setInterval(moveGhosts, 400);
        if (score>=75)
            intervalGhost = setInterval(moveGhosts, 300);
           
    }

    function eatBonus()
    {
        if (board[bonus.i/60][bonus.j/60]===2)
            {
                score+=50;
                bonus.i = 1000;
                bonus.j = 1000;
            }
    }

    function bonusMove()
    {
        
            //if (board[bonus.i/60][bonus.j/60-1]!==4)
            //    bonus.j-=60;
            var rand = Math.random();
            var isMoved=false;

            if (bonus.i>0 && bonus.i<600 && bonus.j>0 && bonus.j<540 && board[bonus.i/60+1][bonus.j/60]!==4 && board[bonus.i/60-1][bonus.j/60]!==4
                && board[bonus.i/60][bonus.j/60-1]!==4 && board[bonus.i/60][bonus.j/60+1]!==4)
            {
                if (rand<0.25)
                {
                    bonus.j+=60;
                }
                if (rand>=0.25&&rand<0.5)
                {
                    bonus.j-=60;
                }
                if (rand>=0.5&&rand<0.75)
                {
                    bonus.i+=60;
                }
                if (rand>=0.75)
                {
                    bonus.i-=60;
                }
            }
            
            else
            {
                while (isMoved===false)
                {
                        if (rand<0.25 && bonus.j<540 && board[bonus.i/60][bonus.j/60+1]!==4)
                    {
                        bonus.j+=60;
                        isMoved=true;
                    }
                    if (rand>=0.25 && rand<0.5 && bonus.j>0 && board[bonus.i/60][bonus.j/60-1]!==4)
                    {
                        bonus.j-=60;
                        isMoved=true;
                    }
                    if (rand>=0.5&&rand<0.75 && bonus.i<600 && board[bonus.i/60+1][bonus.j/60]!==4)
                    {
                        bonus.i+=60;
                        isMoved=true;
                    }
                    if (rand>=0.75 && bonus.i>0 && board[bonus.i/60-1][bonus.j/60]!==4)
                    {
                        bonus.i-=60;
                        isMoved=true;
                    }
                    rand=Math.random();
                }
            }
            ghostBoard[bonus.i/60][bonus.j/60]=100;
            
    }

    function drawPoint(x, y, color){
    context.beginPath();
    context.arc(x, y, 60 , 0, 2 * Math.PI); // circle
    context.fillStyle = color; //color
    context.fill();
    }

    function moveGhosts()
    {
        for (var idx=0; idx<numOfMons; idx++)
        {
            var rand = Math.random();
            //id they're not next to walls or the boarders
            var isMoved=false;
            if (monsArr[idx].j/60 === 1 && (monsArr[idx].i/60 === 1 || monsArr[idx].i/60 === 9))  
              {
                isMoved=true;
                if (shape.j<2)
                    monsArr[idx].j-=60;
                else
                {
                    if (monsArr[idx].i/60 === 1)
                        monsArr[idx].i-=60;
                    else
                        monsArr[idx].i+=60;
                }
              }

              if (monsArr[idx].j/60 === 8 && (monsArr[idx].i/60 === 1 || monsArr[idx].i/60 === 9))  
              {
                isMoved=true;
                if (shape.j>7)
                    monsArr[idx].j+=60;
                else
                {
                    if (monsArr[idx].j/60 === 1)
                        monsArr[idx].i+=60;
                    else
                        monsArr[idx].i-=60;
                }
              }

              if (monsArr[idx].j/60 === 2 && (monsArr[idx].i/60 === 0 || monsArr[idx].i/60 === 10))
              {
                isMoved=true;
                if (shape.j<2)
                    monsArr[idx].j-=60;
                else
                    monsArr[idx].j+=60;
              }

              if (monsArr[idx].j/60 === 7 && (monsArr[idx].i/60 === 0 || monsArr[idx].i/60 === 10))
              {
                isMoved=true;
                if (shape.j>7)
                    monsArr[idx].j+=60;
                else
                    monsArr[idx].j-=60;
              }

            

                    if ((rand<0.5 || monsArr[idx].i/60 === shape.i)  && monsArr[idx].j/60<shape.j 
                    && board[monsArr[idx].i/60][monsArr[idx].j/60+1]!==4 && isMoved===false)
                    {
                        isMoved=true;
                        monsArr[idx].j+=60;
                    }
                    if ((rand<0.5 || monsArr[idx].i/60 === shape.i)  && monsArr[idx].j/60>shape.j
                        && board[monsArr[idx].i/60][monsArr[idx].j/60-1]!==4 && isMoved===false)
                    {
                        isMoved=true;
                        monsArr[idx].j-=60;
                    }
                    if ((rand>=0.5 || monsArr[idx].j/60 === shape.j)  && monsArr[idx].i/60<shape.i
                    && board[monsArr[idx].i/60+1][monsArr[idx].j/60]!==4 && isMoved===false)
                    {
                        isMoved=true;
                        monsArr[idx].i+=60;
                    }
                    if ((rand>=0.5 || monsArr[idx].j/60 === shape.j)  && monsArr[idx].i/60>shape.i
                    && board[monsArr[idx].i/60-1][monsArr[idx].j/60]!==4 && isMoved===false)
                    {
                        isMoved=true;
                        monsArr[idx].i-=60;
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
}




    function initGhosts()
    {
        monsArr[0].i = 0;
        monsArr[0].j = 0;
        ghostBoard[0][0]=51;

        if(numOfMons >= 2) {
        monsArr[1].i = 600;
        monsArr[1].j = 0;
        ghostBoard[10][0]=52;
        }

        if(numOfMons >= 3) {
        monsArr[2].i = 0;
        monsArr[2].j = 540;
        ghostBoard[0][9]=53;
        }

        bonus.i = 600;
        bonus.j = 540;
        ghostBoard[10][9]=100;
    }

    function findRandomEmptyCell(board) {
        var i = Math.floor((Math.random() * 10) + 1);
        var j = Math.floor((Math.random() * 9) + 1);
        while (board[i][j] !== 0) {
            i = Math.floor((Math.random() * 10) + 1);
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
        for (var idx=0; idx<numOfMons; idx++)
        {
            if (board[monsArr[idx].i/60][monsArr[idx].j/60]===2)
            {
            life--;
        if (score>10)
            score-=10;
        else
            score=0;
        if (life==0)
        {
            window.clearInterval(interval);
            window.alert("You lost! \n your score is: "+score);
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
    }
    }

    function Draw() {
        context.clearRect(0, 0, canvas.width, canvas.height); //clean board
        lblScore.value = score;
        lblTime.value = ~~(seconds-time_elapsed);
        lblLife.value = life;
        var startDraw;
        var endDraw;
        var circleX;
        var circleY;
        for (var i = 0; i < 11; i++) {
            for (var j = 0; j < 10; j++) {
                var center = new Object();
                center.x = i * 60 + 30;
                center.y = j * 60 + 30;
                if (board[i][j] === 5) {
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0, 2 * Math.PI);
                    context.fillStyle = "black"; //color
                    context.fill();
                }

                if (board[i][j] === 15) {
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0, 2 * Math.PI);
                    context.fillStyle = "blue"; //color
                    context.fill();
                }

                if (board[i][j] === 25) {
                    context.beginPath();
                    context.arc(center.x, center.y, 15, 0, 2 * Math.PI);
                    context.fillStyle = "red"; //color
                    context.fill();
                }
                if (ghostBoard[i][j] === 100) {
                    context.drawImage(gift, bonus.i, bonus.j, 60, 60);
                }
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
                } 
                else if (board[i][j] === 4) {
                    context.beginPath();
                    context.rect(center.x - 30, center.y - 30, 60, 60);
                    context.fillStyle = "grey"; //color
                    context.fill();
                }
            }
        }


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
            if (shape.i < 10 && board[shape.i + 1][shape.j] !== 4) {
                shape.i++;
            }
        }
        if (board[shape.i][shape.j] === 5) {
            score+=5;
        }
        if (board[shape.i][shape.j] === 15) {
            score+=15;
        }
        if (board[shape.i][shape.j] === 25) {
            score+=25;
        }
        board[shape.i][shape.j] = 2;
        var currentTime = new Date();
        time_elapsed = ~~(currentTime-start_time)/1000;
        if (seconds-time_elapsed <= 0) {
        if (score<150) {
            window.alert("You can do better\n Your score is: "+score);
        }
        else {
            window.alert("We have a Winner!!!\n Your score is: "+score);
        }
        }
        if (score === 4) {
            window.clearInterval(interval);
            window.alert("Game completed");
        } else {
            Draw();
        }    
    }
/***********************************/

function Dictionary() {
  this.dictionary = [];

  this.add = function(key, value) {
    if (key && value) {
      this.dictionary.push({
        key: key,
        value: value
      });
      return this.dictionary;
    }
  };

  this.find = function(key) {
    for (var i = 0; i < this.dictionary.length; i++) {
      if (this.dictionary[i].key == key)
        return this.dictionary[i].value;
    }
    return -1;
  };
  this.keyExists = function(key){
    for (var i = 0; i < this.dictionary.length; i++) {
      if (this.dictionary[i].key == key)
        return true;
    }
    return false;
  }

}
$(function() {
  if(!dictionary) {
    dictionary = new Dictionary();
  }
  $('.content').show().hide();
  $('#welcome').show(1000);
  dictionary.add('a', 'a'); //default user
});

/*welcome screen buttons*/
$('#registerButton').on('click', function(){
  $('#welcome').hide(500);
  $(".loginForm").val('');
  $('#register').slideDown(500);
});
$('#loginButton').on('click', function() {
  $('#welcome').hide(500);
  $(".loginForm").val('');
  $('#login').slideDown(500);
});

/*register form submit button*/
$('#submit-button').on('submit', function(event){
event.preventDefault();
event.stopPropagation();
var formAttributes = document.getElementsByClassName("form-control");
var userName = document.getElementById('usernameID').value;
var firstName = formAttributes[5].value;
var lastName = formAttributes[2].value;
var date = formAttributes[3].value;
var password = document.getElementById('passwordID').value;
dictionary.add(userName, password);
$('#register').hide(500);
$(".form-control").val('');
$('#welcome').slideDown(500);
});

/*login button*/
$('#loginBut').on('click', function(event){
  event.preventDefault();
  event.stopPropagation();
  var loginAttributes = document.getElementsByClassName("loginForm");
  var userName = loginAttributes[0].value;
  user = loginAttributes[0].value;
  var password = loginAttributes[1].value;
  if(dictionary.find(userName) == -1 || dictionary.find(userName) != password){
    alert("Incorrect username or password.");
  }
  else{
    //move to game window
    $('#login').hide();
    $('#gameSettings').show();
  }
});

/*menu links*/
$('#refHome').on('click', function(){
  if($("#game").is(':visible')){
    endGameThroughMenu("welcome");
  }
  else {
    $('.content').hide();
    $('#welcome').show(1000);
  }
});
$('#refRegister').on('click', function(){
  if($("#game").is(':visible')) {
    endGameThroughMenu("register");
  }
  else {
    $('.content').hide();
    $(".loginForm").val('');
    $('#register').show(500);
  }
});
$('#refLogin').on('click', function(){
  if($("#game").is(':visible')) {
    endGameThroughMenu("login");
  }
  else {
    $('.content').hide();
    $(".loginForm").val('');
    $('#login').show(500);
  }
});

$('#startGameButton').on('click', function (event) {
    
    $('#gameSettings').hide();
    $('#game').show(function(){
      Start();
    });
  
  });
/*----------------------------------------------------------?????????????????????*/

  /***********************************/

/***********************************/
