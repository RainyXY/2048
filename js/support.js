// 定义一些相对屏幕的常用尺寸  
documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92*documentWidth;
cellSideLength = 0.18*documentWidth;
cellSpace = 0.04*documentWidth;


//20是格子之间的距离，100是一个小格子的宽度
function getPosTop( i , j ){
//  return 20 + i*(100+20);
	return cellSpace + i*(cellSpace+cellSideLength);
}

function getPosLeft( i , j ){
//  return 20 + j*(100+20);
	return cellSpace + j*(cellSpace+cellSideLength);
}

// 设置不同数字的不同背景颜色 
function getNumberBackgroundColor(number){
    switch( number ){
        case 2   :return '#eee4de';break;
        case 4   :return '#ede0c8';break;
        case 8   :return '#f2b179';break;
        case 16  :return '#f59563';break;
        case 32  :return '#f67c5f';break;
        case 64  :return '#f65e3b';break;
        case 128 :return '#edcf72';break;
        case 256 :return '#edcc61';break;
        case 512 :return '#9c0'   ;break;
        case 1024:return '#33b5e5';break;
        case 2048:return '#09c'   ;break;
        case 4096:return '#a6c'   ;break;
        case 3192:return '#93c'   ;break;
    }
    return "black";
}
// 设置数字的颜色：2和4的颜色都为#776e65，其它数字的颜色为白色  
function getNumberColor( number ){
    if( number <= 4 ){
        return "#776e65";
    }
    return "white";
}

//检测格子上有无空间
function nospace( arr ){
    for( var i = 0 ; i < 4 ; i ++){
        for( var j = 0 ; j < 4 ; j++){
           if( arr[i][j] == 0){
               return false;
           }
        }
    }
    return true;
}

/* 检测能否左移 
 * 1、只需要判断每一行的后3列格子即可。 
 * 2、可以移动的条件是： 
 *   ①当前格子有数字，即 arr[i][j] != 0 
 *   ②左侧格子没有数字，即 (arr[i][j-1] == 0 
 *   ③左侧格子和当前格子数字相同，即 arr[i][j-1] == arr[i][j] 
 */  
function canMoveLeft( arr ){
    for( var i = 0 ; i < 4 ; i ++){
        for( var j = 1 ; j < 4 ; j++){
            if( arr[i][j] != 0 ){
                if( arr[i][j-1] == 0 || arr[i][j-1] == arr[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

//检测能否右移
function canMoveRight( arr ){
    for( var i = 0 ; i < 4 ; i ++){
        for( var j = 0 ; j < 3 ; j++){
            if( arr[i][j] != 0 ){
                if( arr[i][j+1] == 0 || arr[i][j+1] == arr[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

//检测能否上移
function canMoveUp( arr ){
    for( var i = 1 ; i < 4 ; i ++){
        for( var j = 0 ; j < 4 ; j++){
            if( arr[i][j] != 0 ){
                if( arr[i-1][j] == 0 || arr[i-1][j] == arr[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

//检测能否下移
function canMoveDown( arr ){
    for( var i = 0 ; i < 3 ; i ++){
        for( var j = 0 ; j < 4 ; j++){
            if( arr[i][j] != 0 ){
                if( arr[i+1][j] == 0 || arr[i+1][j] == arr[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

//检测行上有无阻碍
function noBlockHorizontal( row , col1 , col2 , arr ){
    for( var i = col1+1 ; i < col2 ; i++){
        if( arr[row][i] != 0){
            return false;
        }
    }
    return true;
}

//检测列上有无阻碍
function noBlockVertical( col , row1 , row2 , arr ){
    for( var i = row1+1 ; i < row2 ; i++){
        if( arr[i][col] != 0){
            return false;
        }
    }
    return true;
}

function nomove(arr){
	if(canMoveUp(arr) || canMoveDown(arr) || canMoveLeft(arr) || canMoveRight(arr)) {
		return false;	
	}
    return true;
}
