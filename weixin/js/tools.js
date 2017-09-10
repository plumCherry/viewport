(function(w){
	w.tools={};
	
	//操作transform的工具类
	w.css=function(node,type,val){
		if(typeof node.transforms ==="undefined"){
				node.transforms={};
			}
			
			//两个参数是读取
			if(arguments.length==2){
				val = node.transforms[type];
				
				if(typeof val ==="undefined"){
					if(type=="scale"){
						val=1;
					}else if(type=="rotate"||type=="translateX"||type=="translateY"||type=="translateZ"){
						val=0;
					}
				}
				
				return val;
				
			}else if(arguments.length>=3){
				//三个参数是设置
				var text="";
				node.transforms[type] = val;
				
				for(item in node.transforms){
					switch (item){
						case "translateX":
						case "translateY":
						case "translateZ":
							text+=item+"("+node.transforms[item]+"px)";
							break;
							
						case "rotate":
							text+=item+"("+node.transforms[item]+"deg)";
							break;
							
						case "scale":
							text+=item+"("+node.transforms[item]+")";
							break;
					}
				}
				
				node.style.transform = node.style.webkitTransform  =text;
			}
	}
	
	
	//获得两点间的距离
	var getDis = tools.getDis =function(p1,p2){
		var a = p1.clientY - p2.clientY;
		var b = p1.clientX - p2.clientX;
		return Math.sqrt(a*a+b*b);
	}
	
	
	/*
	勾股定理:
		斜边的平方 = 直角边1的平方 + 直角边2的平方; 
	
	正切：
		在直角三角形中 对边和临边比值
	
		Math.atan2();	
			对于任意不同时等于0的实参数x和y，atan2(y,x)所表达的意思是坐标原点为起点，
			指向(x,y)的射线在坐标平面上与x轴正方向之间的角的角度。
			当y>0时，射线与x轴正方向的所得的角的角度指的是x轴正方向绕逆时针方向到达射线旋转的角的角度；
			而当y<0时，射线与x轴正方向所得的角的角度指的是x轴正方向绕顺时针方向达到射线旋转的角的角度
	*/
	var getDeg = tools.getDeg=function (p1,p2){
		var a = p1.clientY - p2.clientY;
		var b = p1.clientX - p2.clientX;
		
		var deg = Math.atan2(a,b)*180/Math.PI;
		return deg;
	}
	
	// 自定义多指事件
	//gesTure它没有办法支持手指先放到node上再放到屏幕其他区域是的情况
	tools.gesTure=function (node,callBack){
		
		//控制一根手指点击时不能触发我们的双指事件
		var hasStart = false;
		
		var disStart =0;
		var degStart=0;
		
		//模拟gesTureStart
		//手指触碰当前元素，屏幕上有两根或两根以上的手指
		node.addEventListener("touchstart",function(ev){
			ev=ev||event;
			var touchS = ev.touches;	
			
			hasStart=false;
			
			if(touchS.length>=2){
				hasStart=true;
				disStart=getDis(touchS[0],touchS[1]);
				degStart=getDeg(touchS[0],touchS[1]);
				if(callBack&&callBack["start"]){
					callBack["start"].call(this);
				}
			}
		})
		
		
		//手指触碰当前元素，屏幕上有两根或两根以上的手指,至少有一根发生位移
		node.addEventListener("touchmove",function(ev){
			ev=ev||event;
			var touchS = ev.touches;	
			
			if(hasStart&&touchS.length>=2){
				ev.scale=getDis(touchS[0],touchS[1])/disStart;
				//安卓在实现atant2上的一个问题
				ev.rotation =  getDeg(touchS[0],touchS[1]) -degStart;
				if(callBack&&callBack["change"]){
					callBack["change"].call(this,ev);
				}
			}
		})
		
		
		//必须要经过gesTureStart后 有手指离开 并且最终只剩两根以下
		node.addEventListener("touchend",function(ev){
			ev=ev||event;
			var touchS = ev.touches;	
			if(touchS.length<2&&hasStart){
				if(callBack&&callBack["end"]){
					callBack["end"]();
				}
			}
		})
		
		
	}
	
	
	
})(window)



