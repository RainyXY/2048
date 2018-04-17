var arr = new Array(); //存储游戏的数据
var score = 0;    //得分
var hasConflicted = new Array();

var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	//手机自适应
	prepareForMobile();
	
    newGame();
    
});

function prepareForMobile(){
	
	if(documentWidth > 500){
		gridContainerWidth = 500;
		cellSpace = 20;
		cellSideLength = 100;
	}
	
	$('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('padding', cellSpace);
	$('#grid-container').css('border-radius', 0.02*gridContainerWidth);
	
	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius', 0.02*cellSideLength);
}

$(document).keydown(function(event){
	
    switch(event.keyCode){
    	case 37:   //  left
    		//防止滚动条上下滑
			event.preventDefault();
            if( moveLeft() ){
                 setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38:   //  up
        	event.preventDefault();
            if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39:   //  right
        	event.preventDefault();
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40:   //  down
        	event.preventDefault();
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        
        default : break;
    }
    return false;
});


/*去掉iphone手机滑动默认行为*/

$('body').on('touchmove', function (event) {

    event.preventDefault();

});
//触控 事件监听
document.addEventListener('touchstart',function(event){
	startx = event.touches[0].pageX;
	starty = event.touches[0].pageY;
});

document.addEventListener('touchmove',function(event){
	event.preventDefault();
});

document.addEventListener('touchend',function(event){
	endx = event.changedTouches[0].pageX;
	endy = event.changedTouches[0].pageY;
	
	var deltax = endx - startx;
	var deltay = endy - starty;
	
	//判断是否真的想滑动
	if(Math.abs(deltax) < 0.3*documentWidth && Math.abs(deltay) < 0.3*documentWidth){
		return;
	}
	
	//x
	if(Math.abs(deltax) >= Math.abs(deltay)){
		if(deltax > 0){
			//move right
			if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
		}else{
			//move left
			if( moveLeft() ){
                 setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
		}
	}
	//y
	else{
		if(deltay > 0){
			//move down
			if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
		}else{
			//move up
			if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
		}
	}
});



function newGame(){
	$('#gameover').hide();
    //  初始化棋盘格
    init();
    //  随机生成两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}
/* 
 *  1、初始化棋盘格 gridCell 
 *  2、初始化二维数组 用于存储数据 arr
 *  3、初始化数据 清零 updateArrView(); 
 */  
function init(){

    //  初始化grid-cell 有数字的小方块
    for( var i = 0 ; i < 4 ; i ++){
        for( var j = 0 ; j < 4 ; j++){
            var gridCell =$("#grid-cell-"+i+"-"+j);
            gridCell.css('top',getPosTop( i , j ));
            gridCell.css('left',getPosLeft( i , j ));
        }
    }

    //  初始化arr数组
    for( var i = 0 ; i < 4 ; i ++){
        arr[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++){
            arr[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    // 有操作,更新界面
    updateArrView();
  
    score=0;
    updateScore(score); 
//  $("#score").text(score);
}
//更新棋盘上显示的方块
function updateArrView(){
	//如果有number-cell后先删除
    $(".number-cell").remove();
    //遍历格子，改变样式
    for( var i = 0 ; i < 4 ; i ++){
        for( var j = 0 ; j < 4 ; j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( arr[i][j] == 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                ///这里是为了把它放中间，动画才好看
//              theNumberCell.css('top',getPosTop(i,j) + 50);
//              theNumberCell.css('left',getPosLeft(i,j) + 50);
				//适应手机优化
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2);
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2);
            }else{
//              theNumberCell.css('width','100px');
//              theNumberCell.css('height','100px');
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor(arr[i][j]));
                theNumberCell.css('color',getNumberColor(arr[i][j]));
                theNumberCell.text(arr[i][j]);
            }
            
            hasConflicted[i][j] = false;
        }
    }
    $('.number-cell').css('line-height',cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.5*cellSideLength + 'px');
}

function generateOneNumber(){
	//先看有无空格
    if( nospace( arr )){
        return false;
    }

    //  随机一个位置
    var randx = parseInt(Math.floor(Math.random() * 4));
    var randy = parseInt(Math.floor(Math.random() * 4));
//  //看是不是空格,优化随机
    var times = 0;
    while(times < 50){
        if(arr[randx][randy] == 0){
            break;
        }
        //重复
        var randx=parseInt(Math.floor(Math.random()*4));
        var randy=parseInt(Math.floor(Math.random()*4));

        times++;
    }
    //人工找位置
    if(times == 50){
        for(var i = 0;i < 4;i++){
            for(var j = 0;j < 4;j++){
                if(arr[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }
//  while( true ){
//      if( arr[randx][randy] == 0 ) break;
//      randx = parseInt(Math.floor(Math.random() * 4));
//      randy = parseInt(Math.floor(Math.random() * 4));
//  }

    //  随即一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //  在随机位置显示随机数字
    arr[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;

}



function isgameover(){
	
	if( nospace(arr) && nomove(arr)){
		gameover();
	}
}

function gameover(){
    $('#gameover').show();
}

function moveLeft(){

	// 1、先判断能否向左移动
    if( !canMoveLeft( arr )){
        return false;
    }

    //moveLeft
    
    /*
     * 2、如果可以向左移动：
     *   ①当前的数字是否为0，不为0则进行左移 arr[i][j] != 0 
     *   ②如果左侧为空格子，则数字进行一个移位操作 arr[i][k] == 0 
     *   ③如果左侧有数字且不相等，则数字还是进行移位操作 noBlockHorizontal 
     *   ④如果左侧有数字且相等，则数字进行相加操作 arr[i][k] == arr[i][j] 
     */  
     
    //遍历右边12个格子
    for( var i = 0 ; i < 4 ; i ++){
        for( var j = 1 ; j < 4 ; j++){
            if( arr[i][j] != 0){
            	//有数字则遍历左边
                for( var k = 0 ; k < j ; k ++){
                	//看落点是否为空且路上有无障碍
                    if( arr[i][k] == 0 && noBlockHorizontal( i , k , j , arr)){
                        //move
                        showMoveAnimation( i , j , i , k );
                        //更新位置
                        arr[i][k] = arr[i][j];
                        arr[i][j] = 0;
                        continue;
                    }else if( arr[i][k] == arr[i][j] && noBlockHorizontal( i , k , j , arr) && !hasConflicted[i][j]){
                        //move
                        showMoveAnimation( i , j , i , k );
                        //add更新
                        arr[i][k] += arr[i][j];
                        arr[i][j] = 0;
						
						//add score
						score += arr[i][k];
						updateScore(score);
						
						hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    
	// 3、初始化数据 updateArrView()
	//遍历完后更新格子显示状态,慢一点才能显示动画,设置该函数的等待时间200毫秒 
    setTimeout("updateArrView()",200);
    return true;
}

function moveRight(){

    if( !canMoveRight( arr )){
        return false;
    }

	//遍历左边12个格子
    for( var i = 0 ; i < 4 ; i ++){
        for( var j = 2 ; j > -1 ; j--){
            if( arr[i][j] != 0){
            	//有数字则遍历右边
                for( var k = 3 ; k > j ; k --){
                	//看落点是否为空且路上有无障碍
                    if( arr[i][k] == 0 && noBlockHorizontal( i , j , k , arr)){
                        //move
                        showMoveAnimation( i , j , i , k );
                        //更新
                        arr[i][k] = arr[i][j];
                        arr[i][j] = 0;
                        continue;
                    }
                    else if( arr[i][k] == arr[i][j] && noBlockHorizontal( i , j , k , arr) && !hasConflicted[i][j]){
                        //move
                        showMoveAnimation( i , j , i , k );
                        //add更新
                        arr[i][k] += arr[i][j];
                        arr[i][j] = 0;
                        
                        //add score
						score += arr[i][k];
						updateScore(score);
	
						hasConflicted[i][k] = true;
						
                        continue;
                    }
                }
            }
        }
    }
	
	//完整动画播放
    setTimeout("updateArrView()",200);
    return true;
}

function moveUp(){

    if( !canMoveUp( arr )){
        return false;
    }
    
    //遍历下边12个格子
    for( var j = 0 ; j < 4 ; j++ ){
        for( var i = 1 ; i < 4 ; i ++ ){
            if( arr[i][j] != 0){
            	//有数字则遍历上边
                for( var k = 0 ; k < i ; k ++){
                	//看落点是否为空且路上有无障碍
                    if( arr[k][j] == 0 && noBlockVertical( j , k , i , arr)){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //更新位置
                        arr[k][j] = arr[i][j];
                        arr[i][j] = 0;
                        continue;
                    }else if( arr[k][j] == arr[i][j] && noBlockVertical( j , k , i , arr) && !hasConflicted[i][j]){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add更新
                        arr[k][j] += arr[i][j];
                        arr[i][j] = 0;
                        
                        //add score
						score += arr[k][j];
						updateScore(score);
						
						hasConflicted[i][k] = true;

                        continue;
                    }
                }
            }
        }
    }
	
	//遍历完后更新格子显示状态,慢一点才能显示动画
    setTimeout("updateArrView()",200);
    return true;
}

function moveDown(){

    if( !canMoveDown( arr )){
        return false;
    }
    
    //遍历下边12个格子
    for( var j = 0 ; j < 4 ; j++ ){
        for( var i = 2 ; i > -1 ; i-- ){
            if( arr[i][j] != 0){
            	//有数字则遍历下边
                for( var k = 3 ; k > i ; k --){
                	//看落点是否为空且路上有无障碍
                    if( arr[k][j] == 0 && noBlockVertical( j , i , k , arr)){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //更新位置
                        arr[k][j] = arr[i][j];
                        arr[i][j] = 0;
                        continue;
                    }else if( arr[k][j] == arr[i][j] && noBlockVertical( j , i , k , arr) && !hasConflicted[i][j]){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add更新
                        arr[k][j] += arr[i][j];
                        arr[i][j] = 0;
                        
                        //add score
						score += arr[k][j];
						updateScore(score);
						
						hasConflicted[i][k] = true;

                        continue;
                    }
                }
            }
        }
    }
	
	//遍历完后更新格子显示状态,慢一点才能显示动画
    setTimeout("updateArrView()",200);
    return true;
}