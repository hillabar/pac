
var user;
var dictionary;
var shape = new Object();
    var bonus=new Object();
    var timeBunny=new Object();
    var heart=new Object();
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
    var heart;
    var seconds;
    var allFood;
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
    var medicine = new Image();
    medicine.src = 'medicine.png';
    var ballsNum;
    var ghostNum;
    var secondNum;
    var context = canvas.getContext("2d");

    function Start() {
        window.addEventListener("keydown", function(e) {
            // space and arrow keys
            if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);
        
        seconds=secondNum;//need to edit by the user
        numOfMons=ghostNum;//need to edit by the user
      
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
        var food_remain = ballsNum;
        var food_5_remain = Math.floor(food_remain*0.6);
        var food_15_remain = Math.floor(food_remain*0.3);
        var food_25_remain = Math.floor(food_remain*0.1);
        allFood = food_5_remain+food_15_remain+food_25_remain;
        food_remain = allFood;
        var pacman_remain = 1;
        start_time = new Date();
        
        for (var i = 0; i < 11; i++) {
            board[i] = new Array();
            ghostBoard[i] = new Array();
            //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
            for (var j = 0; j < 12; j++) {
                
                if ((i === 2 && j === 1) || (i === 1 && j === 2) || (i === 2 && j === 2) || (i === 4 && j === 1) || (i === 5 && j === 1)|| (i === 6 && j === 1)|| (i === 8 && j === 1)|| (i === 8 && j === 2)|| (i === 9 && j === 2)|| (i === 5 && j === 2)||
                (i === 2 && j === 10) || (i === 1 && j === 9) || (i === 2 && j === 9) || (i === 4 && j === 10) || (i === 5 && j === 10)|| (i === 6 && j === 10)|| (i === 8 && j === 10)|| (i === 8 && j === 9)|| (i === 9 && j === 9)|| (i === 5 && j === 9)) 
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
        
        intervalEat = setInterval(eatPacman, 100);
        interval = setInterval(UpdatePosition, 100);
        intervalEatBonus = setInterval(eatBonus, 100);
        intervalEatMedicine = setInterval(eatMedicine,100);
        intervalGift = setInterval(bonusMove, 600);
        intervalTime = setInterval(timeBunnyMove, 600);
        intervalGhost = setInterval(moveGhosts, 500);
        intervalMedicine = setInterval(medicineMove,600);
        intervalEatTime = setInterval(eatTime,100);//******** */
           
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

    function eatTime()//*************** */
    {
        if (board[timeBunny.i/60][timeBunny.j/60]===2)
            {
                seconds+=10;
                timeBunny.i = 1000;
                timeBunny.j = 1000;
            }
    }


    function eatMedicine()//*************** */
    {
        if (board[heart.i/60][heart.j/60]===2)
            {
                life+=1;
                heart.i = 1000;
                heart.j = 1000;
            }
    }

    function timeBunnyMove()
    {
            var random = Math.random();
            var is_Moved=false;

            if (timeBunny.i>0 && timeBunny.i<600 && timeBunny.j>0 && timeBunny.j<660 && board[timeBunny.i/60+1][timeBunny.j/60]!==4 && board[timeBunny.i/60-1][timeBunny.j/60]!==4
                && board[timeBunny.i/60][timeBunny.j/60-1]!==4 && board[timeBunny.i/60][timeBunny.j/60+1]!==4)
            {
                if (random<0.25)
                {
                    timeBunny.j+=60;
                }
                if (random>=0.25&&random<0.5)
                {
                    timeBunny.j-=60;
                }
                if (random>=0.5&&random<0.75)
                {
                    timeBunny.i+=60;
                }
                if (random>=0.75)
                {
                    timeBunny.i-=60;
                }
            }
            
            else
            {
                while (is_Moved===false)
                {
                        if (random<0.25 && timeBunny.j<660 && board[timeBunny.i/60][timeBunny.j/60+1]!==4)
                    {
                        timeBunny.j+=60;
                        is_Moved=true;
                    }
                    if (random>=0.25 && random<0.5 && timeBunny.j>0 && board[timeBunny.i/60][timeBunny.j/60-1]!==4)
                    {
                        timeBunny.j-=60;
                        is_Moved=true;
                    }
                    if (random>=0.5&&random<0.75 && timeBunny.i<600 && board[timeBunny.i/60+1][timeBunny.j/60]!==4)
                    {
                        timeBunny.i+=60;
                        is_Moved=true;
                    }
                    if (random>=0.75 && timeBunny.i>0 && board[timeBunny.i/60-1][timeBunny.j/60]!==4)
                    {
                        timeBunny.i-=60;
                        is_Moved=true;
                    }
                    random=Math.random();
                }
            }
            var currI=timeBunny.i/60;
            var currJ=timeBunny.j/60;
            ghostBoard[currI][currJ]=200;     
    }

    function medicineMove()
    {
            var random1 = Math.random();
            var is_Moved1=false;

            if (heart.i>0 && heart.i<600 && heart.j>0 && heart.j<660 && board[heart.i/60+1][heart.j/60]!==4 && board[heart.i/60-1][heart.j/60]!==4
                && board[heart.i/60][heart.j/60-1]!==4 && board[heart.i/60][heart.j/60+1]!==4)
            {
                if (random1<0.25)
                {
                    heart.j+=60;
                }
                if (random1>=0.25&&random1<0.5)
                {
                    heart.j-=60;
                }
                if (random1>=0.5&&random1<0.75)
                {
                    heart.i+=60;
                }
                if (random1>=0.75)
                {
                    heart.i-=60;
                }
            }
            
            else
            {
                while (is_Moved1===false)
                {
                        if (random1<0.25 && heart.j<660 && board[heart.i/60][heart.j/60+1]!==4)
                    {
                        heart.j+=60;
                        is_Moved1=true;
                    }
                    if (random1>=0.25 && random1<0.5 && heart.j>0 && board[heart.i/60][heart.j/60-1]!==4)
                    {
                        heart.j-=60;
                        is_Moved=true;
                    }
                    if (random1>=0.5&&random1<0.75 && heart.i<600 && board[heart.i/60+1][heart.j/60]!==4)
                    {
                        heart.i+=60;
                        is_Moved1=true;
                    }
                    if (random1>=0.75 && heart.i>0 && board[heart.i/60-1][heart.j/60]!==4)
                    {
                        heart.i-=60;
                        is_Moved1=true;
                    }
                    random1=Math.random();
                }
            }
            var Icurr=heart.i/60;
            var Jcurr=heart.j/60;
            ghostBoard[Icurr][Jcurr]=300;     
    }


    function bonusMove()
    {
        
            var random = Math.random();
            var is_Moved=false;

            if (bonus.i>0 && bonus.i<600 && bonus.j>0 && bonus.j<660 && board[bonus.i/60+1][bonus.j/60]!==4 && board[bonus.i/60-1][bonus.j/60]!==4
                && board[bonus.i/60][bonus.j/60-1]!==4 && board[bonus.i/60][bonus.j/60+1]!==4)
            {
                if (random<0.25)
                {
                    bonus.j+=60;
                }
                if (random>=0.25&&random<0.5)
                {
                    bonus.j-=60;
                }
                if (random>=0.5&&random<0.75)
                {
                    bonus.i+=60;
                }
                if (random>=0.75)
                {
                    bonus.i-=60;
                }
            }
            
            else
            {
                while (is_Moved===false)
                {
                        if (random<0.25 && bonus.j<660 && board[bonus.i/60][bonus.j/60+1]!==4)
                    {
                        bonus.j+=60;
                        is_Moved=true;
                    }
                    if (random>=0.25 && random<0.5 && bonus.j>0 && board[bonus.i/60][bonus.j/60-1]!==4)
                    {
                        bonus.j-=60;
                        is_Moved=true;
                    }
                    if (random>=0.5&&random<0.75 && bonus.i<600 && board[bonus.i/60+1][bonus.j/60]!==4)
                    {
                        bonus.i+=60;
                        is_Moved=true;
                    }
                    if (random>=0.75 && bonus.i>0 && board[bonus.i/60-1][bonus.j/60]!==4)
                    {
                        bonus.i-=60;
                        is_Moved=true;
                    }
                    random=Math.random();
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

              if (monsArr[idx].j/60 === 10 && (monsArr[idx].i/60 === 1 || monsArr[idx].i/60 === 9))  
              {
                isMoved=true;
                if (shape.j>9)
                    monsArr[idx].j+=60;
                else
                {
                    if (monsArr[idx].i/60 === 1)
                        monsArr[idx].i-=60;
                    else
                        monsArr[idx].i+=60;
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

              if (monsArr[idx].j/60 === 9 && (monsArr[idx].i/60 === 0 || monsArr[idx].i/60 === 10))
              {
                isMoved=true;
                if (shape.j>9)
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
        monsArr[2].j = 660;
        ghostBoard[0][11]=53;
        }

        bonus.i = 600;
        bonus.j = 660;
        ghostBoard[10][11]=100;

        timeBunny.i=540;
        timeBunny.j=360;
        ghostBoard[9][6]=200;

        heart.i=180;
        heart.j=360;
        ghostBoard[3][6]=300;
    }

    function findRandomEmptyCell(board) {
        var i = Math.floor((Math.random() * 10) + 1);
        var j = Math.floor((Math.random() * 11) + 1);
        while (board[i][j] !== 0) {
            i = Math.floor((Math.random() * 10) + 1);
            j = Math.floor((Math.random() * 11) + 1);
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
        var circleX;
        var circleY;
        for (var i = 0; i < 11; i++) {
            for (var j = 0; j < 12; j++) {
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
                if (ghostBoard[i][j] === 200) {
                    context.drawImage(clocky, timeBunny.i, timeBunny.j, 45, 60);
                }

                if (ghostBoard[i][j] === 300) {
                    context.drawImage(medicine, heart.i, heart.j, 60, 60);
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
            if (shape.j < 11 && board[shape.i][shape.j + 1] !== 4) {
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
            allFood--;
        }
        if (board[shape.i][shape.j] === 15) {
            score+=15;
            allFood--;
        }
        if (board[shape.i][shape.j] === 25) {
            score+=25;
            allFood--;
        }
        board[shape.i][shape.j] = 2;
        var currentTime = new Date();
        time_elapsed = ~~(currentTime-start_time)/1000;
        if (seconds-time_elapsed <= 0) {
        if (score<150) {
            window.clearInterval(interval);
            window.alert("You can do better\n Your score is: "+score);
        }
        else {
            window.clearInterval(interval);
            window.alert("We have a Winner!!!\n Your score is: "+score);
        }
        }
        if (allFood == 0) {
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
    event.preventDefault();
    event.stopPropagation();
    ballsNum=document.getElementById('myRange').value;
    ghostNum=document.getElementById('selectNumOfGhosts').value;//**************** */
    secondNum=document.getElementById('gameTime').value;//************** */
    $('#gameSettings').hide();
    $('#game').show(function(){
      Start();
    });
  
  });