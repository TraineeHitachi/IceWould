/*
 * Author: Chonghan Chen (paulcccccch@gmail.com)
 * -----
 * Last Modified: Wednesday, 24th March 2021 11:53:10 am
 * Modified By: Chonghan Chen (paulcccccch@gmail.com)
 * Modified By: Kobe Norris (KobeNorrisWu@gmail.com)
 * -----
 * Copyright (c) 2021 IceWould Information Technology Co., Ltd.
 */


// 初始化
// 定义方块和画面大小，在完成逻辑之前最好先不要动哦。 
var BLOCKSIZE = 20;	//in pixel
var ROW_NUM = 20;
var COL_NUM = 10;

var score = 0;

// 定义全部的七种方块。
var PIECE_NUM = 1;
var bar = [[0, 0], [-1, 0], [1, 0], [2, 0]];
var sevenShape = [[-1, -1], [-1, 0], [0, 0], [1, 0]];
var square = [[0, 0], [1, 0], [0, 1], [1, 1]]
var sevenShapeReversed = [[-1, 1], [-1, 0], [0, 0], [1, 0]];
var hump = [[0, 0], [-1, 0], [0, 1], [0, -1]]
var zShape = [[0, 0], [0, 1], [-1, 1], [1, 0]]
var zShapeReversed = [[0, 0], [0, 1], [1, 1], [-1, 0]]

var LAYOUTS = [square, bar, sevenShape, sevenShapeReversed, hump, zShape, zShapeReversed];
var COLORS = ['red', 'blue', 'pink', 'purple', 'silver', 'orange', 'grey'];

// 定义储存游戏板的二维数组，以存储方块的状态，并初始化各项为 null
var occupationMatrix = new Array(20);
for (var i = 0; i < ROW_NUM; i++) {
    occupationMatrix[i] = new Array(COL_NUM);
    for (var j = 0; j < COL_NUM; j++) {
        occupationMatrix[i][j] = null;
    }
}

// 生成一个新的 piece ，并插入到 gameBoard 中
function generatePiece() {
    // 获取 HTML 文件中的内容板 --> gameBoard
    var gameBoard = document.getElementById('gameBoard');

    // 随机获取一种方块
    pieceIdx = 3;
    // Math.floor(PIECE_NUM * Math.random());

    // 生成一个方块的 DOM （其实是 HTML 中的一个 <div> 标签）
    var newPiece = initializePiece(pieceIdx);

    // 将这个 piece 挂到 gameBoard 内容板里
    newPiece.id = "currentPiece";
    gameBoard.appendChild(newPiece);

    // 初始化 piece 位置
    setPosition(newPiece, 0, 4);
}

// 初始化 piece 的 attribute 及其 children (blockList)
function initializePiece(pieceTypeIdx) {
    /*
        在这个函数里，你需要返回一个 <div> 标签。
        你需要根据 pieceIdx，来从 LAYOUTS 这个变量中拿出对应的方块，

        提示：
        - 你可以使用 document.createElement 来生成 DOM
        - 你可以使用 DOM 变量的 .appendChild 方法来把其它 DOM 塞进去
        - 你可以直接设置 DOM 变量的各种字段，这就和在 HTML 标签里加各种参数效果一样
    */

    /************************
        YOUR CODE STARTS
    *************************/
    var newPiece = document.createElement('div');

    newPiece.className = 'piece';
    newPiece.layout = LAYOUTS[pieceTypeIdx];

    for (var i = 0; i < 4; i++) {
        var newBlock = document.createElement('div')
        newBlock.style.width = BLOCKSIZE + 'px';
        newBlock.style.height = BLOCKSIZE + 'px';
        newBlock.style.background = COLORS[pieceTypeIdx];
        newBlock.className = 'block';
        newPiece.appendChild(newBlock);
    }
    /************************
        YOUR CODE ENDS
    *************************/

    return newPiece;
}

// 重新定义 piece 的位置
function setPosition(piece, row, col) {
    /**
     * 请认真阅读这个函数。它的参数是一个 piece，以及它的新的行和列。
     */

    // 拿到 piece 的所有子节点
    //      blockList 就是一个数组，比如 blockList[0] 就是第一个 DOM
    var blockList = piece.children;

    // layout 就是 “定义方块” 中的一种
    var layout = piece.layout;

    // 把新位置存储在母节点的对应属性中（只是记录一下而已，对页面没有什么影响）
    piece.rowPos = row;
    piece.colPos = col;

    // 设置母节点的位置 :
    //      top --> 与 DOM 中 gameBoard 上边缘的距离
    //      left --> 与 DOM 中 gameBoard 左边缘的距离
    piece.style.top = row * BLOCKSIZE + 'px';
    piece.style.left = col * BLOCKSIZE + 'px';

    // 设置所有子节点的位置，并储存
    for (var i = 0; i < piece.children.length; i++) {
        block = blockList[i]
        block.rowPos = row + layout[i][0];
        block.colPos = col + layout[i][1];
        block.style.top = block.rowPos * BLOCKSIZE + 'px';
        block.style.left = block.colPos * BLOCKSIZE + 'px';
    }
}

// 更新occupationMatrix，即储存方块状态的二维数组
function updateOccupationMatrix(piece) {
    var blockList = piece.children;
    var targetCol, targetRow;
    for (var idx = 0; idx < 4; idx++) {
        targetCol = blockList[idx].colPos;
        targetRow = blockList[idx].rowPos;
        if (targetCol >= 0 && targetRow >= 0)
            occupationMatrix[targetRow][targetCol] = blockList[idx];
    }
}



// 每调用一次这个函数，当前的方块就会下落一格
function pieceMoveDown() {
    /************************
        YOUR CODE STARTS
    *************************/
    var currentPiece = document.getElementById('currentPiece');
    if (isMoveDownValid(currentPiece)) {
        setPosition(currentPiece, currentPiece.rowPos+1, currentPiece.colPos);
    } else {
        updateOccupationMatrix(currentPiece);
        currentPiece.id = "";
        check();
    }
    /************************
        YOUR CODE ENDS
    *************************/

}

// 判断方块是否能继续下落，返回Bool
function isMoveDownValid(piece) {
    /************************
        YOUR CODE STARTS
    *************************/
    var blockList = piece.children;
    for (var i = 0; i < 4; i++) {
        if (!(blockList[i].rowPos < ROW_NUM - 1 && occupationMatrix[blockList[i].rowPos+1][blockList[i].colPos] == null))
            return false;
    }
    return true;
    /************************
        YOUR CODE ENDS
    *************************/
}

// 检查游戏板的状态（行满->消除，触顶->游戏结束），若游戏不结束则调用 generatePiece()
function check() {
    for (var rowIdx = 0; rowIdx < ROW_NUM; rowIdx++) {
        if (rowFull(rowIdx)) {
            clearRow(rowIdx);
            rowDown(rowIdx);
            rowIdx--;
        }
    }

    if (topReached())
        gameOver();
    else
        generatePiece();
}

// 判断一行是否已满，返回Bool
function rowFull(rowNumber) {
    /************************
        YOUR CODE STARTS
    *************************/
    for (var rowIdx = 0; rowIdx < COL_NUM; rowIdx++) {
        if (occupationMatrix[rowNumber][rowIdx] == null) {
            return false;
        }
    }

    return true;
    /************************
        YOUR CODE ENDS
    *************************/
}

// 判断最顶部是否被方块占据，返回Bool
function topReached() {
    /************************
        YOUR CODE STARTS
    *************************/
    for (var idx = 0; idx < COL_NUM; idx++) {
        if (occupationMatrix[0][idx] != null) {
            return true;
        }
    }

    return false;
    /************************
        YOUR CODE ENDS
    *************************/
}

// 消除一行方块
function clearRow(rowNumber) { 
    /************************
        YOUR CODE STARTS
    *************************/
    for (var i = 0; i < COL_NUM; i++) {
        occupationMatrix[rowNumber][i].parentNode.removeChild(occupationMatrix[rowNumber][i]);
        occupationMatrix[rowNumber][i] = null;
    }
    score++;
    var showScore = document.getElementById("score");
    showScore.innerHTML = score;
    /************************
        YOUR CODE ENDS
    *************************/

}

// 被消除行上面的所有方块均下移一行
function rowDown(rowNumber) {
    /**
     * Update the occupation matrix
     * Update the block positions
     */
    for (var row = rowNumber - 1; row >= 0; row--) {
        for (var col = 0; col < COL_NUM; col++) {
            if (occupationMatrix[row][col]) {
                var block = occupationMatrix[row][col];
                block.rowPos += 1;
                occupationMatrix[row][col] = null;
                occupationMatrix[row + 1][col] = block;
                block.style.top = block.rowPos * BLOCKSIZE + 'px';
                block.style.left = block.colPos * BLOCKSIZE + 'px';
            }
        }
    }
}



// Button / Keybord operation
// allow keyboard operation
document.onkeydown = function (event) {
    /************************
        YOUR CODE STARTS
    *************************/
    var event = window.event ? window.event : event;
    var currentPiece = document.getElementById('currentPiece');
    switch (event.keyCode) {
        case 68: //d
            fallToBottom(currentPiece);
            break;
        case 77: //m
            rotateClock(currentPiece);
            break;
        case 78: //n
            rotateAntiClock(currentPiece);
            break;
        case 37: //left
            moveLeft(currentPiece);
            break;
        case 39: //right
            moveRight(currentPiece);
            break;
    }
    /************************
        YOUR CODE ENDS
    *************************/
    return;
}

// '<-' move left
function moveLeft(piece) {
    /************************
        YOUR CODE STARTS
    *************************/
    var blockList = piece.children;
    for (var i = 0; i < 4; i++) {
        if (!(blockList[i].colPos > 0 && occupationMatrix[blockList[i].rowPos][blockList[i].colPos-1] == null))
            return;
    }
    setPosition(piece, piece.rowPos, piece.colPos-1);
    /************************
        YOUR CODE ENDS
    *************************/
}

// '->' move right
function moveRight(piece) {
    /************************
        YOUR CODE STARTS
    *************************/
    var blockList = piece.children;
    for (var i = 0; i < 4; i++) {
        if (!(blockList[i].colPos < COL_NUM - 1 && occupationMatrix[blockList[i].rowPos][blockList[i].colPos+1] == null))
            return;
    }
    setPosition(piece, piece.rowPos, piece.colPos+1);
    /************************
        YOUR CODE ENDS
    *************************/
}

// 'd' fall to bottom
function fallToBottom(piece) {
    /**
     * 这个函数会让方块一路落到最底
     * 调用 isMoveDownValid 判断是否可以下落
     */

    /************************
        YOUR CODE STARTS
    *************************/
    while (isMoveDownValid(piece)) 
        setPosition(piece, piece.rowPos+1, piece.colPos);
    /************************
        YOUR CODE ENDS
    *************************/
}

// 'm' rotate colckwise
function rotateClock(piece) {
    /**
     * 这个函数可以顺时针旋转当前方块
     * 可能会用到一点线性代数的知识（百度：旋转矩阵）
     * 也可以用坐标系旋转理解（不懂抓 Kobe 来问）
     * 拿笔和纸算一下就好啦～
     * 感觉有难度的话请寻求帮助！
     */

    /************************
        YOUR CODE STARTS
    *************************/
    for (var i = 0; i < 4; i++)
        piece.layout[i]=[piece.layout[i][1],-piece.layout[i][0]];

    var rectifyleft = 0;
    var rectifyright = 0;
    for (var i = 0;i < 4; i++) {
        if (rectifyleft + piece.layout[i][1] + piece.colPos <= 0)
            rectifyleft = -piece.layout[i][1] - piece.colPos;
        if (rectifyright + piece.layout[i][1] + piece.colPos >= COL_NUM - 1)
            rectifyright = COL_NUM - piece.layout[i][1] - piece.colPos - 1;
    }

    for (var i = 0; i < 4; i++){
        if (occupationMatrix[piece.layout[i][0] + piece.rowPos][piece.colPos + piece.layout[i][1] + rectifyleft + rectifyright] != null) {
            for (var i = 0; i < 4; i++)
                piece.layout[i] = [-piece.layout[i][1], piece.layout[i][0]];
            return;
        }
    }
    setPosition(piece, piece.rowPos, piece.colPos + rectifyleft + rectifyright);
    alert('in rotate: \n'+ sevenShapeReversed +'\n' + piece.layout);
    /************************
        YOUR CODE ENDS
    *************************/
}

// 'n' rotate anticlockwise
function rotateAntiClock(piece) {
    /**
     * 这个函数可以逆时针旋转当前方块
     * 可能会用到一点线性代数的知识（百度：旋转矩阵）
     * 也可以用坐标系旋转理解（不懂抓 Kobe 来问）
     * 拿笔和纸算一下就好啦～
     * 感觉有难度的话请寻求帮助！
     */

    /************************
        YOUR CODE STARTS
    *************************/
    for (var i=0; i<4; i++)
        piece.layout[i] = [-piece.layout[i][1], piece.layout[i][0]];

    var rectifyleft = 0;
    var rectifyright = 0;
    for (var i = 0;i < 4; i++) {
        if (rectifyleft + piece.layout[i][1] + piece.colPos <= 0)
            rectifyleft = -piece.layout[i][1] - piece.colPos;
        if (rectifyright + piece.layout[i][1] + piece.colPos >= COL_NUM - 1)
            rectifyright = COL_NUM - piece.layout[i][1] - piece.colPos - 1;
    }

    for (var i = 0; i < 4; i++){
        if (occupationMatrix[piece.layout[i][0] + piece.rowPos][piece.colPos + piece.layout[i][1] + rectifyleft + rectifyright] != null) {
            for (var i = 0;i < 4; i++)
                piece.layout[i]=[piece.layout[i][1],-piece.layout[i][0]];
            return;
        }
    }
    setPosition(piece, piece.rowPos, piece.colPos + rectifyleft + rectifyright);
    /************************
        YOUR CODE ENDS
    *************************/
}



// start the game
function play() {
    /**
     * 这个函数被调用后，游戏会开始。你可以清理一下 occupationMatrix，或者设置一些事件。
     * 注意判断一下游戏是否已经开始。
     */

    /************************
        YOUR CODE STARTS
    *************************/
    score = 0;
    var showScore = document.getElementById("score");
    showScore.innerHTML = score;
    // 清理 interval
    clearInterval(window.a);   
    // 清理 game board
    cleanBoard();
    // 生成第一个方块
    generatePiece();
    /************************
        YOUR CODE ENDS
    *************************/

    // 每秒执行一次函数中的操作，比如下落
    window.a = setInterval(function () {
        pieceMoveDown();
    }, 300)

}



function gameOver() {
    /**
     * 游戏结束的时候可能需要调用这个函数。
     */
    alert("Game Over");
    clearInterval(window.a);
    // cleanBoard();
}

function cleanBoard() {
    /**
     * 清空游戏面板
     */
    for (var i = 0; i < ROW_NUM; i++) {
        for (var j = 0; j < COL_NUM; j++) {
            occupationMatrix[i][j] = null;
        }
    }
    document.getElementById("gameBoard").innerHTML = "";
}

function show() {
    /**
     * 刷新一次所有 DOM 在 HTML 页面上的位置
     */
    var all = document.getElementById('gameBoard');
    var len = all.children.length;

    for (var i = 0; i < len; i++) {
        var piece = all.children[i];
        var len2 = piece.children.length;
        for (var j = 0; j < len2; j++) {
            var block = piece.children[j];
            block.style.top = (block.rowPos) * BLOCKSIZE + 'px';
            block.style.left = (block.colPos) * BLOCKSIZE + 'px';
        }
    }
}