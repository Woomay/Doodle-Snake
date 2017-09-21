//游戏参数配置
var config={
	map:{width:1000,height:600},
	square:{width:20,height:20},
	getRows:function(){return this.map.height/this.square.height;},
	getCols:function(){return this.map.width/this.square.width;},
	getNum:function(){return this.getRows()*this.getCols();}			
};
//游戏辅助变量
var help={
	squares:[],//保存所有方块对象
	snake:[],
	foods:[],
	foodIndex:-1,//记录当前食物的编号
	dir:3,//默认取3向右
	handler:null
};
function removeEleFromArr(arr,ele){
	for(var i=0;i<arr.length;i++){
		if(arr[i]==ele){
			arr.splice(i,1);
			break;
		}
	}
}
function getNewHeadIndex(h_index){
	var h_new_index=-1;//新蛇头位置编号
	switch(help.dir){
		case 1://向左
			//h_new_index=h_index-1;
			h_new_index=h_index%config.getCols()==0
						?h_index+(config.getCols()-1)
						:h_index-1;
			break;
		case 2://向上
			h_new_index=h_index<config.getCols()
						?(config.getRows()-1)*config.getCols()+h_index
						:h_index-config.getCols();
			break;
		case 3://向右
			h_new_index=h_index+1;
			h_new_index=h_new_index%config.getCols()==0
						?h_new_index-config.getCols()
						:h_new_index;
			break;
		case 4://向下
			h_new_index=h_index+config.getCols();
			h_new_index=h_new_index>=config.getNum()
						?h_new_index-config.getNum()
						:h_new_index;
			break;
	}
	return h_new_index;
}
function isInBody(h_new_index){
	for(var i=0;i<help.snake.length;i++){
		if(help.snake[i]==h_new_index)
			return true;	
	}
	return false;
}
//初始化地图
function initMap(){
	id('map').style.width=config.map.width+'px';
	id('map').style.height=config.map.height+'px';
	var num=config.getNum();
	for(var i=0;i<num;i++){
		var span=document.createElement('span');
		span.style.width=config.square.width+'px';
		span.style.height=config.square.height+'px';
		id('map').appendChild(span);
		//初始化全局辅助变量
		help.squares.push(span);
		if(i<=4){
			help.snake.push(i);
			span.className='snake';
		}
		else help.foods.push(i);
	}
}
//随机在地图中刷新一个实物
function showFood(){
	var index=Math.floor(Math.random()*help.foods.length);
	help.foodIndex=help.foods[index];
	help.squares[help.foods[index]].className='food';
}
function snakeMove(){
	//处理蛇头
	var h_index=help.snake[help.snake.length-1];
	var h_new_index=getNewHeadIndex(h_index);//得出了新蛇头的编号
	//判断是不是撞死
	if(isInBody(h_new_index)){
		clearInterval(help.handler);
		alert('Game Over...')
		if(confirm('Once again?'))
			window.location.href=window.location.href;//刷新页面
		else
			window.close();//关闭窗口
		return;
	}
	help.squares[h_new_index].className='snake';
	removeEleFromArr(help.foods,h_new_index);
	help.snake.push(h_new_index);
	//处理蛇尾
	if(h_new_index!=help.foodIndex){
		help.squares[help.snake[0]].className='';
		help.foods.push(help.snake.shift());
	}else{
		showFood();
	}	
}
window.onload=function(){
	initMap();
	showFood();
	help.handler=setInterval(snakeMove,300);
	document.onkeyup=function(e){
		if(e.keyCode>=37&&e.keyCode<=40);
		help.dir=e.keyCode-36;//点击事件改变方向
	}
}