document.querySelector('body').style.height = window.innerHeight;
const canvas = document.querySelector('#canvas');
const canvas1 = document.querySelector('#nextTetriminos')
const ctx1 = canvas1.getContext('2d');
const scoreCard = document.querySelector('#scoreCard');
const ctx = canvas.getContext('2d');
let interval = ''
let gameStart = new Audio('gameStart.wav');
let blockPlaced = new Audio('blockPlaced.wav');
let gameFinish = new Audio('gameFinish.wav');
if(screen.width <= 750){
	canvas.width = screen.width-100;
	canvas.height = screen.height-300;
}
else{
	document.getElementsByClassName('controller')[0].style.display="none";
	canvas.width = '420';
	canvas.height = 1.8*canvas.width;	
	canvas1.height = '100';
	canvas1.width = canvas.width-260
	scoreCard.style.height = canvas.height+'px';
	scoreCard.style.width = (canvas.width-260)+'px';
}
let curr_score = 0
let high_score = 0
let grid = [
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0]
		];
const blockWidth = canvas.width/grid[0].length;
const blockHeight = canvas.height/grid.length;
let tetriminos = [
				[[1],
				[1],
				[1],
				[1]], 
						   
				[[1, 0, 0],
				[1, 1, 1]],
						   
				[[ 0, 0, 1],
				[ 1, 1, 1]],
						   
				[[1, 1],
				[1, 1]],
						   
				[[0, 1, 1],
				[1, 1, 0]],
						   
				[[1, 1, 0],
				[0, 1, 1]],
						   
				[[0, 1, 0],
                [1, 1, 1]]
];
const tetriminoColor = ["#000099", "#00ccff", "#ffcc00", "#ffff00", "#33cc33", "#cc33ff", "#ff3300"];
let x = blockWidth*4;
let y = 0;
let index = Math.floor(Math.random()*100)%7;
let tetriminoArray = []
while(tetriminoArray.length!=4){
	let x = (Math.floor(Math.random()*100))%7;
	if(!tetriminoArray.includes(x) )
		tetriminoArray.push(x);
	}

const tetris = {
	draw: function(){
		let x=0;
		let y=0;
		for(let i=0;i<16;i++){
			x = 0;
			for(let j=0; j<10; j++){
				if(grid[i][j] == 0){
					ctx.beginPath();
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
					ctx.rect(x, y, blockWidth, blockHeight);
					ctx.stroke();	
					ctx.closePath();
				}
				else{
					ctx.beginPath();
					ctx.fillStyle = tetriminoColor[grid[i][j]-1];
					ctx.fillRect(x, y, blockWidth, blockHeight);
					ctx.fill();	
					ctx.strokeStyle = 'white';
					ctx.lineWidth = 2;
					ctx.rect(x, y, blockWidth, blockHeight);
					ctx.stroke();
					ctx.closePath();
				}
				x += blockWidth;
			}
			y += blockHeight;
		}
	}
}
const tetrimino = {
	newTetrimino:function(){
		curr_score+=5;
        document.getElementById('curr_score').innerText = `Your Score : ${curr_score}`;
        blockPlaced.play();
		x = blockWidth*5;
		y = 0;
		// index = Math.floor(Math.random()*100)%7
		
		index =  tetriminoArray.shift();
		while(tetriminoArray.length!=4){
			let x = (Math.floor(Math.random()*100))%7;
			if(!tetriminoArray.includes(x) )
				tetriminoArray.push(x);	
		}
		drawTetrimino(tetriminoArray[0]);
		
		
	},
	draw:function(X, Y, index){
		ctx.beginPath();
		let x = X
		let y = Y
		ctx.moveTo(x, y);
		for(let i=0; i < tetriminos[index].length;i++){
			x = X;
			for(let j=0;j<tetriminos[index][i].length;j++){
				if(tetriminos[index][i][j] == 1){
					ctx.fillStyle = tetriminoColor[index];
					ctx.fillRect(x, y, blockWidth, blockHeight);
					ctx.fill();
					ctx.lineWidth = 2;
					ctx.strokeStyle = 'white';
					ctx.rect(x, y, blockWidth, blockHeight);
					ctx.stroke();
				}
				x+= blockWidth;
			}
			y += blockHeight;
		}
		ctx.closePath();
	},
	move:function(e){
	clear();
	tetris.draw();
	tetrimino.draw(x,y,index);
		if(e.keyCode == 40){
			if(y+(tetriminos[index].length*blockHeight) >= canvas.height){
				y = canvas.height-(tetriminos[index].length*blockHeight);
				for(let i= 0;i<tetriminos[index].length;i++){
					for(let j=0; j<tetriminos[index][i].length;j++){
						if(tetriminos[index][i][j] == 1){
							grid[Math.floor((y/blockHeight)+i)][Math.floor((x/blockWidth)+j)] = index+1	
						}
					}
				}
				this.newTetrimino();
			}
			else{
				let c = 0
				for(let i=0;i<tetriminos[index].length;i++){
					for(let j=0;j<tetriminos[index][i].length;j++){
						if(tetriminos[index][i][j] == 1 && grid[Math.floor(((y/blockHeight)+1)+i)][Math.floor((x/blockWidth)+j)] != 0){
							for(let p= 0;p<tetriminos[index].length;p++){
					for(let q=0; q<tetriminos[index][p].length;q++){
						if(tetriminos[index][p][q] == 1){
							grid[Math.floor((y/blockHeight)+p)][Math.floor((x/blockWidth)+q)] = index+1	
						}
					}
				}
							c=1;
						}
					}
				}
				if(c!=1)
					y+=blockHeight
				else{
					console.log('called');
					if(y/blockHeight == 0)
						destroy();
					else
						this.newTetrimino();	
				}
			}
		}
		else if(e.keyCode == 37){
			
			
			if(x-blockWidth < 0){
				x=0;
			}
			else{
				let c = 0
				for(let i=0;i<tetriminos[index].length;i++){
					for(let j=0;j<tetriminos[index][i].length;j++){
						if(tetriminos[index][i][j] == 1 && grid[Math.floor((y/blockHeight)+i)][Math.floor(((x/blockWidth)-1)+j)] != 0){
							c=1;
						}
					}
				}
				if (c!=1)
					x -= blockWidth
			}	
			
			
		}
		else if(e.keyCode == 38){
			if(index == 0){
				if(x+(4*blockWidth)<=canvas.width && tetriminos[index].length == 4)
					tetriminos[index] = [[1,1,1,1]]
				else if(y+blockHeight<=canvas.height && grid[Math.floor((y/blockHeight)+1)][Math.floor(x/blockWidth)]!=1)
					tetriminos[index] = [[1],
										[1],
										[1],
										[1]]
			}
			else if(index==1){
				if(y+(3*blockHeight)<=canvas.height && grid[Math.floor((y/blockHeight)+2)][Math.floor(x/blockWidth)]==0 && tetriminos[index].length == 2 && tetriminos[index][1][0] == 1){
					tetriminos[index] = [[1, 1],
										[1, 0],
										[1, 0]]
				}
				else if(x+(tetriminos[index].length*blockWidth)<=canvas.width && grid[Math.floor(y/blockHeight)][Math.floor((x/blockWidth))+tetriminos[index].length] == 0 &&tetriminos[index].length == 3)
					tetriminos[index] = [[1, 1, 1],
										[0, 0, 1]]
				else if(tetriminos[index].length == 2 && tetriminos[index][1][0] == 0)
					tetriminos[index] = [[1, 0, 0],
										[1, 1, 1]]	
			}
			else if(index==2){
				if(y+(3*blockHeight)<=canvas.height && grid[Math.floor((y/blockHeight))+2][Math.floor(x/blockWidth)]==0 && tetriminos[index].length == 2 && tetriminos[index][0][0]==0)
					tetriminos[index] = [[1, 0],
										[1, 0],
										[1, 1]]
				else if(x+(tetriminos[index].length*blockWidth)<=canvas.width && grid[Math.floor(y/blockHeight)][Math.floor((x/blockWidth))+tetriminos[index].length] == 0 && tetriminos[index].length == 3 && tetriminos[index][2][0]==1)
					tetriminos[index] = [[1, 1, 1],
										[1, 0, 0]]
				else if(y+(3*blockHeight)<=canvas.height && grid[Math.floor((y/blockHeight))+2][Math.floor(x/blockWidth)]==0 &&  tetriminos[index].length == 2 && tetriminos[index][0][0]==1)
					tetriminos[index] = [[1, 1],
										[0, 1],
										[0, 1]]	
				else if(x+(tetriminos[index].length*blockWidth)<=canvas.width && grid[Math.floor(y/blockHeight)][Math.floor((x/blockWidth))+tetriminos[index].length] == 0 && tetriminos[index].length == 3 && tetriminos[index][2][0]==0)
					tetriminos[index] = [[0, 0, 1],
										[1, 1, 1]]	
			}
			else if(index == 3)
				tetriminos[index] = tetriminos[index]
			else if(index == 4){
				if(tetriminos[index].length==2 && y+(3*blockHeight)<=canvas.height && grid[Math.floor((y/blockHeight))+3][Math.floor(x/blockWidth)]==0)
					tetriminos[index] = [[1, 0],
										[1, 1],
										[0, 1]]
				else if( tetriminos[index].length==3 && x+(2*blockWidth)<=canvas.width && grid[Math.floor(y/blockHeight)][Math.floor((x/blockWidth))+2]==0)
					tetriminos[index] = [[0, 1, 1],
										[1, 1, 0]]
			}
			else if(index == 5){
				if(y+(3*blockHeight)<=canvas.height && grid[Math.floor((y/blockHeight))+3][Math.floor(x/blockWidth)]==0 && tetriminos[index].length == 2)
					tetriminos[index] = [[0, 1],
										[1, 1],
										[1, 0]]
				else if(x+(2*blockWidth)<=canvas.width && grid[Math.floor(y/blockHeight)][Math.floor((x/blockWidth))+2]==0 && tetriminos[index].length == 3)
					tetriminos[index] = [[1, 1, 0],
										[0, 1, 1]]
				
			}
			else if(index == 6){
				if(tetriminos[index].length==2 && tetriminos[index][0][0] == 0 && y+(3*blockHeight)<=canvas.height && grid[Math.floor((y/blockHeight))+3][Math.floor(x/blockWidth)]==0)
					tetriminos[index] = [[1, 0],
										[1, 1],
										[1, 0]]
				else if(tetriminos[index].length==3 && tetriminos[index][0][0] == 1 && x+(2*blockWidth)<=canvas.width && grid[Math.floor(y/blockHeight)][Math.floor((x/blockWidth))+2]==0)
					tetriminos[index] = [[1, 1, 1],
										[0, 1, 0]]
				else if(tetriminos[index].length==2 && tetriminos[index][0][0] == 1 && y+(3*blockHeight)<=canvas.height && grid[Math.floor((y/blockHeight))+3][Math.floor(x/blockWidth)]==0)
					tetriminos[index] = [[0, 1],
										[1, 1],
										[0, 1]]
				else if(tetriminos[index].length==3 && tetriminos[index][0][0] == 0 & x+(2*blockWidth)<=canvas.width && grid[Math.floor(y/blockHeight)][Math.floor((x/blockWidth))+2]==0)
					tetriminos[index] = [[0, 1, 0],
										[1, 1, 1]]
					
			}
		}
		else if(e.keyCode == 39){
			if(x+(tetriminos[index][0].length*blockWidth) >= canvas.width)
				x = canvas.width-(tetriminos[index][0].length*blockWidth);
			else{
				let c = 0
				for(let i=0;i<tetriminos[index].length;i++){
					for(let j=0;j<tetriminos[index][i].length;j++){
						if(tetriminos[index][i][j] == 1 && grid[Math.floor((y/blockHeight))+i][(Math.floor((x/blockWidth))+1)+j] != 0){
							c=1;
						}
					}
				}
				if (c!=1)
					x += blockWidth;
			}
			
		}
	},
}


function drawTetrimino(idx){
	ctx1.clearRect(0,0,canvas1.width,canvas1.height);
	ctx1.beginPath();
	let xx = (canvas.width/2)-10;
	let yy = 5;
	let blockWidth = canvas1.width/7;
	let blockHeight = canvas1.height/5;
	for(let i=0; i < tetriminos[idx].length;i++){
			xx = 5;
			for(let j=0;j<tetriminos[idx][i].length;j++){
				if(tetriminos[idx][i][j] == 1){
					ctx1.fillStyle = tetriminoColor[idx];
					ctx1.fillRect(xx, yy, blockWidth, blockHeight);
					ctx1.fill();
					ctx1.lineWidth = 2;
					ctx1.strokeStyle = 'white';
					ctx1.rect(xx, yy, blockWidth, blockHeight);
					ctx1.stroke();
				}
				xx+= blockWidth;
			}
			yy += blockHeight;
		}
	ctx1.closePath()
}
function clear(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}
function play(){
	clear();
	tetris.draw();
	tetrimino.draw(x, y, index);
	tetrimino.move(e={'keyCode':40});
}
function init(){
	ctx.font = "25px Arial";
	ctx.fillStyle = "white";
ctx.textAlign = "center";
	ctx.fillText("Click to start playing", (canvas.width/2), (canvas.height/2)-50);
	ctx.fillText("Use ← ↓ → keys to move", (canvas.width/2), (canvas.height/2));
	ctx.fillText("and ↑ key to rotate", (canvas.width/2), (canvas.height/2)+50);
	
	if(screen.width <= 750){
		document.getElementById('left').addEventListener('click', ()=>{
			tetrimino.move(e={'keyCode':37});
		})
		
document.getElementById('rotate').addEventListener('click', ()=>{
			tetrimino.move(e={'keyCode':38});
		})
		document.getElementById('right').addEventListener('click', ()=>{
			tetrimino.move(e={'keyCode':39});
		})
		document.getElementById('down').addEventListener('click', ()=>{
			tetrimino.move(e={'keyCode':40});
		})
	}
	
	
	canvas.addEventListener('click', () => {
        clear();
        gameStart.play();
		interval = window.setInterval(play, 1000);
		drawTetrimino(tetriminoArray[0]);
		window.addEventListener('keydown',e => {
			tetrimino.move(e);
		})
	},{once:true});
	tetris.draw();
}
function destroy(){
	high_score = Math.max(curr_score, high_score);
	document.getElementById('high_score').innerText = `High Score : ${high_score}`;
	curr_score=0;
    document.getElementById('curr_score').innerText = `Your Score : ${curr_score}`;
    gameFinish.play();
	window.clearInterval(interval);
	clear();
	x = blockWidth*4;
	y = 0
	grid = []
	interval = ''
	for(let i=0 ;i<16;i++)
		grid.push([0,0,0,0,0,0,0,0,0,0]);
	index = (Math.floor(Math.random()*10))%7;
	init();
}

init();