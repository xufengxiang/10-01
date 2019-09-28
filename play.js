var c = document.getElementById('canvas');
var cxt = c.getContext('2d');
var lev = window.location.href.split('#')[1]-0;
if (lev) {
    lev = lev;
}else{
    lev=0;
};
//initNum:转动球数；       waitNum：等待球数量；     speed：计时器毫秒数；
var levArray = [{
        'initNum': 3,
        'waitNum': 4,
        'speed': 250
    },
    {
        'initNum': 4,
        'waitNum': 5,
        'speed': 200
    },
    {
        'initNum': 5,
        'waitNum': 5,
        'speed': 150
    },
    {
        'initNum': 6,
        'waitNum': 6,
        'speed': 100
    },
    {
        'initNum': 7,
        'waitNum': 6,
        'speed': 80
    },
    {
        'initNum': 8,
        'waitNum': 7,
        'speed': 50
    }
];
//大球半径和坐标
var cenX = 300;
var cenY = 240;
var cenR = 50;
var smallR = 10;
//设置旋转球
var ro_Ball = [];
//旋转球数组的长度
var ro_BallLength = levArray[lev].initNum;
//为每个球添加旋转角度和球上的数字
for (var i = 0; i < ro_BallLength; i++) {
    var angle = (360 / ro_BallLength) * (i + 1);
    ro_Ball.push({
        angle: angle,
        numStr: ''
    })
};
//设置等待球
var w_Ball = [];
//绘制等待球距离上方的距离
var w_ballUpLength = 200;
//等待球的y坐标
var waitBallY = w_ballUpLength + cenY;
//等待球数组的长度
var w_BallLength = levArray[lev].waitNum;
//为每个等待球添加旋转角度和等待球上的数字
for (var i = w_BallLength; i > 0; i--) {
    w_Ball.push({
        angle: '',
        numStr: i
    })
};
//绘制线的长度
var line = 140;
//绘制大圆
function big() {
    cxt.save();
    cxt.beginPath();
    cxt.arc(cenX, cenY, cenR, 0, 360);
    cxt.fillStyle = 'black';
    cxt.fill();
    cxt.stroke();
    cxt.closePath();
    cxt.restore();
    //大圆里的数据
    cxt.save();
    cxt.beginPath();
    cxt.font = '60px 黑体';
    cxt.textAlign = 'center';
    cxt.textBaseline = 'middle';
    cxt.fillStyle = 'white';
    cxt.strokeStyle = 'white';
    cxt.fill();
    cxt.stroke();
    cxt.fillText(lev+1, cenX, cenY);
    cxt.closePath();
    cxt.restore();
};
console.log(waitBallY);
//绘制等待球
function waitBall() {
    cxt.clearRect(0,400,c.width,c.height)
    w_Ball.forEach(function (e) {
        cxt.save();
        cxt.beginPath();
        cxt.arc(cenX, waitBallY, smallR, 0, Math.PI * 2, true);
        cxt.fillStyle = 'black';
        cxt.fill();
        cxt.stroke();
        cxt.closePath();
        cxt.restore();
        //等待球中的数字
        cxt.save();
        cxt.beginPath();
        cxt.font = '10px 黑体';
        cxt.textAlign = 'center';
        cxt.textBaseline = 'middle';
        cxt.fillStyle = 'white';
        cxt.strokeStyle = 'white';
        cxt.fill();
        cxt.stroke();
        cxt.fillText(e.numStr, cenX, waitBallY);
        cxt.closePath();
        cxt.restore();
        waitBallY += 3 * smallR;
    })
};
//绘制转动球
function initBall(deg) {
    ro_Ball.forEach(function (e) {
        cxt.save();
        //图行组合
        cxt.globalCompositeOperation = 'destination-over';
        e.angle = deg + e.angle;
        if (e.angle == 360) {
            e.angle = e.angle - 360;
        }
        //绘制直线
        cxt.beginPath();
        cxt.moveTo(cenX, cenY);
        //旋转圆的圆心坐标
        var rad = 2 * Math.PI * e.angle / 360;
        var x = cenX + line * Math.cos(rad);
        var y = cenY + line * Math.sin(rad);
        cxt.strokeStyle = 'black';
        cxt.lineTo(x, y);
        cxt.stroke();
        cxt.closePath();
        //绘制圆
        cxt.beginPath();
        cxt.arc(x, y, smallR, 0, Math.PI * 2, true);
        cxt.fillStyle = 'black';
        cxt.fill();
        cxt.closePath();
        cxt.restore();
        //绘制文字
        if(e.numStr){
        cxt.save();
        cxt.beginPath();
        cxt.font = '10px 黑体';
        cxt.textAlign = 'center';
        cxt.textBaseline = 'middle';
        cxt.fillStyle = 'white';
        cxt.strokeStyle = 'white';
        cxt.fill();
        cxt.stroke();
        cxt.fillText(e.numStr, x, y);
        cxt.closePath();
        cxt.restore();
        }    
    })
};
//数据综合和初始化
function in_play(deg) {
    cxt.clearRect(0, 0, c.width, c.height);
    big();
    initBall(deg);
    waitBall();
};
in_play(0);
//计时器
setInterval((function(){
    cxt.clearRect(0,0,c.width,400);
    big();
    initBall(10);
}),levArray[lev].speed);
//点击事件
var state=null;
document.onclick = function(){
	if(w_Ball.length==0) return;
	var ball = w_Ball.shift();//等待球顶部移除一个，并返回值
	ball.angle = 90;//设置移除的等待球的角度
	//判断是否闯关成功
	ro_Ball.forEach(function(e, index) {
        if(Math.abs(e.angle - ball.angle) <360*smallR/(line*Math.PI)) {
			state = 0;
		} else if(index === ro_Ball.length - 1
			&&w_Ball.length === 0) {
				state = 1;
		}
	});
	ro_Ball.push(ball);//转动球数组中添加刚才移除的等待球
	//重新绘制等待球
    waitBallY = 440;
	waitBall();
	initBall(0);
	if(state==0){
        alert("闯关失败");
		window.location.href = "index.html#"+lev;
	}else if(state==1){
        alert("闯关成功"); 
        lev++;
        window.location.href = "index.html#"+lev;
	}
};