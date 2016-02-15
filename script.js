<!--AUTHOR-PRATEEK AGARWAL-->
<!--15-FEB-2016-->

<!--NOTE-FOR EACH RECTANGULAR ELEMENT THE CO-ORDINATES ARE OF THE TOP-LEFT VERTEX-->
var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

var r_pressed = false;	<!--RIGHT KEY PRESSED BOOL-->
var l_pressed = false;	<!--LEFT KEY PRESSED BOOL-->

<!--PADDLE ATTRIB-->
var paddle_ht = 10,paddle_wd = 100;
var paddleX = (canvas.width-paddle_wd)/2;
var paddleY = canvas.height-paddle_ht-20;

<!--BALL ATTRIB-->
var x,y,dx,dy;
x=paddleX+paddle_wd/2;
y=canvas.height-paddle_ht-30;
dx=dy=3;	<!--DETERMINES CHANGE IN X,Y CO-ORDINATE/SPEED-->
var r=10;

<!--IS-PAUSE?-->
var isps=true;

var count=30;
var mask=[[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1]];

<!--REMOVE THE PADDLE-->
function clear_paddle(){
	ctx.clearRect(paddleX,paddleY,paddle_wd,paddle_ht);
}

<!--SETS THE PARAMETERS TO THEIR INITIAL VALUES-->
function reset(){
	count=30;
	isps=false;
	r_pressed = l_pressed = false;
	clear_paddle();
	paddleX = (canvas.width-paddle_wd)/2;
	x=paddleX+paddle_wd/2;
	y=canvas.height-paddle_ht-30;
	document.getElementById("capt").innerHTML="SPACE to PAUSE and ENTER to RESET";
	dx = dy = 3;
	for (var i = 0;i<5;i+=1){
		for (var j=0;j<6;j+=1) mask[i][j]=1;
	}
}

function draw_tiles(){
	ctx.beginPath();
	for (var col = 0;col<6;col+=1){
		for (var row = 0;row<5;row+=1){
			if (mask[row][col]==1){
				ctx.rect(10+col*90,10+row*40,80,30);
			}
		}
	}
	ctx.fillStyle = '#66ccff';
	ctx.fill();
	ctx.closePath();
}

function draw_paddle(){
	ctx.beginPath();
	ctx.rect(paddleX,paddleY,paddle_wd,paddle_ht);
	ctx.fillStyle = '#66ccff';
	ctx.fill();
	ctx.closePath();
}

<!--BUG-PRONE(HANDLE WITH CAUTIONS)-->
function change_states(x,y){
	var col = parseInt((x-10)/90);
	var row = parseInt((y-10)/40);
	<!--BOUNDARY CONDITION-->
	if (x<=r||(x+r)>=canvas.width) dx*=-1;
	if (y<=r) dy*=-1;
	<!--BALL MISSED BY PADDLE-->
	if (y>canvas.height+r) isps=true;
	<!--BALL HITTING THE TILE FROM BELOW-->
	if (dy<0 && row<5 && mask[row][col]==1){
		mask[row][col]=0;
		count-=1;
		dy*=-1;
	}
	<!--BALL HITTING THE TILE FROM ABOVE-->
	else if (dy>0 && row<4 && mask[row+1][col]==1 && (y+r)>=(10+40*(row+1))){
		mask[row+1][col]=0;
		count-=1;
		dy*=-1;
	}
	
	<!--BALL HITTING THE TILE FROM LEFT-->
	if (dx>0 && row<5 && col<5 && mask[row][col+1]==1 && (x+r)>=(10+90*(col+1))){
		mask[row][col+1]=0;
		count-=1;
		dx*=-1;
	}
	<!--BALL HITTING THE TILE FROM RIGHT-->
	else if (dx<0 && row<5 && mask[row][col]==1){
		mask[row][col]=0;
		count-=1;
		dx*=-1;
	}
	<!--BALL HITTING THE PADDLE VERTICALLY(FROM ABOVE/BELOW)-->
	if (y+r>=paddleY && x>=paddleX-3&& x<=(paddleX+paddle_wd+3) && y+r+5<=paddleY+10){
		dy*=-1;
		y-=5;<!--I have no clue why i put this :|-->
		if (x>=paddleX&&x<paddleX+paddle_wd/4) dx-=1;
		if (x<=paddleX+paddle_wd&&x>paddleX+0.75*paddle_wd) dx+=1;
		if (r_pressed==true) dx+=1;
		if (l_pressed==true) dx-=1;
	}
	<!--BALL HITTING THE PADDLE HORIZONTALLY(FROM LEFT/RIGHT)-->
	else if (y+r>=paddleY && y+r+5<=paddleY+10&&(((x+r)>=paddleX && x<paddleX)||(x-r<=(paddleX+paddle_wd)&&x>paddleX))){
		dx*=-1;
		dy*=-1;
	}
}

function draw_ball(){
	change_states(x,y);
	ctx.beginPath();
	ctx.arc(x,y,r,0,2*Math.PI,false);
	ctx.fillStyle = '#66ccff';
	ctx.fill();
	ctx.closePath();
	x+=dx;
	y+=dy;
}

function draw(){
	if (count==0){
		isps=true;
		document.getElementById("capt").innerHTML="YOU WON! Press ENTER to RESET";
	}
	<!--ONLY MOVE THE BALL IF NOT PAUSE-->
	if (isps==false){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		draw_ball();
		if (r_pressed==true && paddleX<canvas.width-paddle_wd-10) paddleX+=7;
		else if (l_pressed==true && paddleX>10) paddleX-=7;
	}
		draw_paddle();
		draw_tiles();
}

function keyDownHandler(key){
	<!--39 IS RIGHT-KEY-->
	if (key.keyCode==39) r_pressed = true;
	<!--37 IS LEFT-KEY-->
	else if (key.keyCode==37) l_pressed = true;
}

function keyUpHandler(key){
	if (key.keyCode==39) r_pressed = false;
	else if (key.keyCode==37) l_pressed = false;
	<!--32 IS SPACEBAR-->
	else if (key.keyCode==32){
		if (isps==false) isps=true;
		else if (isps==true) isps=false;
	}
	<!--13 IS ENTER KEY-->
	else if (key.keyCode==13){
		reset();
	}
}
document.addEventListener("keydown",keyDownHandler,false);
document.addEventListener("keyup",keyUpHandler,false);
<!--RUNNING THE DRAW FUNCTION AFTER EVERY 10ms-->
setInterval(draw,10);
