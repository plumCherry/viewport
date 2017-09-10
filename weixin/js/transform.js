(function(w){
	w.drag={};

	w.drag=function(wrap,callBack){

			var inner = wrap.children[0];
			//开启3d硬件加速
			css(inner,"translateZ",0.001);
			
			//拖拽元素可以滑动的最大距离，可是在值上面是最小值
			
			var minY =  wrap.clientHeight -inner.offsetHeight;
			//元素一开始的位置
			var elementP = {x:0,y:0};
			//手指一开始的位置
			var startP =0;
			
			
			//上一次的时间
			var lastTime =0;
			//上一次的位置
			var lastPoint = 0;
			//时间差
			var timeVal = 1;
			//位置差
			var disVal = 0;
			
			//防抖动
			var isY = true;
			var isFirst=true;

			
			wrap.addEventListener("touchstart",function(ev){
				ev=ev||event;
				var touchC = ev.changedTouches[0];
				
				//兼容dom渲染 将clientHeight系列的值放到一个异步操作中去
				minY =  wrap.clientHeight -inner.offsetHeight;

				
				inner.style.transition="none";
				
				//同步手指和元素一开始的位置
				elementP={x:css(inner,"translateX"),y:css(inner,"translateY")};
				startP={clientX:touchC.clientX,clientY:touchC.clientY};
				
				//同步时间与位置信息
				lastTime = new Date().getTime();
				lastPoint = touchC.clientY;
				
				disVal=0;
				timeVal = 1;
				
				isY = true;
				isFirst=true;
				
				
				if(callBack&&typeof callBack["start"] ==="function"){
					callBack["start"]();
				}
			})
			wrap.addEventListener("touchmove",function(ev){
				if(!isY){
					return;
				}
				
				
				ev=ev||event;
				var touchC = ev.changedTouches[0];
				//手指的实时位置
				var nowP = touchC;
				var disX = nowP.clientX - startP.clientX;
				var disY = nowP.clientY - startP.clientY;
				
				//左边的留白
				var translateY = elementP.y+disY;
				
				
				//橡皮筋效果
				var scale =0;
				if(translateY>0){

					scale = document.documentElement.clientHeight/(document.documentElement.clientHeight+translateY);
					translateY=elementP.y+disY*scale;
				}else if(translateY<minY){
					var over = minY - translateY;
					scale = document.documentElement.clientHeight/(document.documentElement.clientHeight+over);
					translateY=elementP.y+disY*scale;
				}
				
				if(isFirst){
					isFirst=false;
					if(Math.abs(disX)>Math.abs(disY)){
						isY=false;
						return;
					}
				}
				
				
				css(inner,"translateY",translateY);
				
				//每一次touchmove时的时刻
				var nowTime = new Date().getTime();
				//每一次touchmove时的手指的位置
				var nowPoint = touchC.clientY;
				//时间差
				timeVal=nowTime-lastTime;
				//位置差
				disVal = nowPoint-lastPoint;
				
				lastTime = nowTime;
				lastPoint= nowPoint;
				
				if(callBack&&typeof callBack["move"] ==="function"){
					callBack["move"]();
				}
			})
			wrap.addEventListener("touchend",function(){
				//这是最后一次touchmove的速度
				var speed = disVal/timeVal;
				var time =	Math.abs(speed*0.3);
				time=time<0.3?0.3:time;
				var target = css(inner,"translateY")+speed*200;
				
//				var bsr ="";
				var type = "Linear";
				if(target>0){
					target=0;
					//控制回弹
//					bsr ="cubic-bezier(.82,1.24,.75,1.26)";
					type="Back";
				}else if(target<minY){
					target=minY;
					//控制回弹
//					bsr ="cubic-bezier(.82,1.24,.75,1.26)";
					type="Back";
				}
//				inner.style.transition=time*10+"s "+bsr;
//				css(inner,"translateY",target);
				move(type,target,time);//模拟过渡效果
				
				
				if(callBack&&typeof callBack["end"] ==="function"){
					callBack["end"]();
				}
			})
			
			function move(type,target,time){
				var point=0;
				// 当前次数
				var t=0;
				//初始位置
				var b=css(inner,"translateY");
				//目标位置与开始位置之间的差值
				var c = target -b;
				//总次数
				var d = time/0.02;
				//回弹距离
				var s;
				clearInterval(wrap.clearTime);
				wrap.clearTime=setInterval(function(){
					t++;
					if(t<=d){
						point=Tween[type](t,b,c,d,s);
						css(inner,"translateY",point);
						
						if(callBack&&typeof callBack["move"] ==="function"){
							callBack["move"]();
						}
					}else{
						clearInterval(wrap.clearTime);
						
						if(callBack&&typeof callBack["over"] ==="function"){
							callBack["over"]();
						}
					}
				},20)
			}
		}

})(window)
