$(function(){
	var row=4,line=4;
	var cellObject={},//初始化所有的位置数据对象
	cellArray=[],//初始化所有的位置数据数组
	isStartGame=false,//判断是否开始游戏
	scoreNum=0;//初始化分数
	var sellPiont={};//获取所有已经有点位的数据信息
	function gameInit(row,line){
		$(".gameFrameCell").html("");
		/*初始化参数*/
		/*获取行列数*/
		row=row,line=line,cellObject={},cellArray=[],sellPiont={};//初始化所有的位置数据
		for(var i = 0;i < row;i++){
			for(var j = 0;j < line;j++){
				var cellKey=i+""+j;
				//cellArray.push(cellKey);//组装位置数组格式，00 01 02 03 11 ...
				cellObject[cellKey]={};//组建对象里面的对象，达到多层的效果
				cellObject[cellKey].row=i;//排
				cellObject[cellKey].line=j;//列
				
			}
		}
	}
	function randomRendering(){
		/*随机位置随机赋值，赋值局限(2,4)*/
		var num=Math.floor(Math.random()*2),//取随机值，0 产生2 的块，1产生4的块。
		cellNum=2;//初始化为2的块
		var createCell="",//新建的节点
		power=1;//因为js没有计算固定的开根次的方法，只有 sqrt() ，开平方，
		if(num==0){
			createCell=$('<span class="color1" power="1">2</span>');
			power=1;
			cellNum=2;
		}else{
			createCell=$('<span class="color2" power="2">4</span>');
			cellNum=4;
			power=2;
			
		}
		cellArray=Object.keys(cellObject);//组装位置数组格式，00 01 02 03 11 ...
		/*console.log(cellArray.length);*/
		/*获取长度的随机数，随机获取位置块的数据*/
		var pointsLength=Object.keys(cellObject).length;
		if(pointsLength<=0){
			alert("游戏结束！")
			return false;
		}
		var pointNum=Math.floor(Math.random()*pointsLength);
		
		/*获取位置块在对象里面的内容*/
		var point=cellObject[cellArray[pointNum]];
		/*找到对应的位置块，添加内容*/
		$(".gameFrameUl").eq(point.row).find(".gameFrameCell").eq(point.line).addClass("active").append(createCell);
		
		/*删除已经被占据位置的坐标块 需要在对象和数据里面同步删除*/
		delete cellObject[cellArray[pointNum]];
		sellPiont[cellArray[pointNum]]={};
		sellPiont[cellArray[pointNum]].cellNum=cellNum;
		sellPiont[cellArray[pointNum]].power=power;
		cellArray.splice(pointNum,1);
	}

	
	
	/*绑定游戏开始时间*/
	$(".gameStart").bind("click",function(){
		gameInit(4,4);
		isStartGame=true;
		/*恢复分数初始化*/
		scoreNum=0;
		score(scoreNum);
		randomRendering();
	});
	
	/*上下左右键盘事件*/
	$(document).keydown(function(event){
		var e = event || window.event || arguments.callee.caller.arguments[0];
		
		/*上*/
		if(e.keyCode==38){
			$(".upBtn").click();
		}
		/*左*/
		if(e.keyCode==37){
			$(".leftBtn").click();
		}
		/*右*/
		if(e.keyCode==39){
			$(".rightBtn").click();
		}
		/*下*/
		if(e.keyCode==40){
			$(".downBtn").click();
		}
	});
	
	/*操作键绑定事件*/
	/*上键事件*/
	
	$(".upBtn").bind("click",function(){
		if(!isStartGame){
			alert("你还没有开始游戏。")
			return false;
		}
		/*获取所有已存在的位置*/
		var cellArrayActive=Object.keys(sellPiont);
		/*对已有位置数据在对应方向上的比较 包括判断方向上是否存在其他块数据 是否能够相加，暴扣方向上最顶端处理之后中间是否留有空余位置用于二次移动但不靠口练习相加，
		 * 如果存在 2 2 4 ，前面两个2相加得4 这时两个4之间有一个空格，所以不能做相加处理，只能把后者4往方向端移动一步*/
		cellArrayActive.sort(function(a,b){
			return a-b;
		})
		var cellArrayLen=cellArrayActive.length;
		for(var i = 0;i<cellArrayLen;i++){
			var rowSubscript=Math.floor(cellArrayActive[i]/10);//获取所在的排数，便于比较
			if(rowSubscript>0){
				var upRowNum=rowSubscript-1;
				var upLineNum=cellArrayActive[i]%10;
				createNewRow(upRowNum);
			}
		}
		function createNewRow(upRowNum){
			
			if(upRowNum>=0){
				var upCellnmu=upRowNum+""+upLineNum;//获取方向端前列的一个方块的坐标，用于判断是否有值 sellPiont[upCellnmu]==true 有值
				/*console.log(upCellnmu);*/
				if(sellPiont[upCellnmu]){
					
					/*邻近的方向端块有值*/
					if(sellPiont[upCellnmu].cellNum==sellPiont[cellArrayActive[i]].cellNum){
						/*如果方向位置有有数据且数据相同，则可以相加处理*/
						sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum*2;
						sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power+1;
						scoreNum=scoreNum+1;
						score(scoreNum);
						/*sellPiont[upCellnmu].power+=1;
						console.log(sellPiont[cellArray[i]].power);*/
						var upCell=$('<span class="color'+sellPiont[upCellnmu].power+'">'+sellPiont[upCellnmu].cellNum+'</span>');
						$(".gameFrameUl").eq(upRowNum).find(".gameFrameCell").eq(upLineNum).addClass("active").html(upCell);
						$(".gameFrameUl").eq(rowSubscript).find(".gameFrameCell").eq(upLineNum).addClass("active").html("");
						/*释放空格*/
						/*delete cellObject[sellPiont[cellArray[i]]];*/
						cellArrayActive.push(cellArrayActive[i]);
						cellObject[cellArrayActive[i]]={};//排
						cellObject[cellArrayActive[i]].row=rowSubscript;//排
						cellObject[cellArrayActive[i]].line=upLineNum;//列
						
						delete sellPiont[cellArrayActive[i]];
						return false;
					}else{
						upRowNum=upRowNum+1;
						upCellnmu=upRowNum+""+upLineNum;
						if(upCellnmu!=cellArrayActive[i]){
							/*方向端没有数据的时候开始移动*/
							/*console.log(upCellnmu);
							console.log(cellArrayActive[i]);*/
							
							/*方向端没有数据的时候开始移动*/
							sellPiont[upCellnmu]={};
							sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum;
							sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power;
							
							cellObject[cellArrayActive[i]]={};//排
							cellObject[cellArrayActive[i]].row=rowSubscript;//排
							cellObject[cellArrayActive[i]].line=upLineNum;//列
							/*页面上删除展示效果*/
							$(".gameFrameUl").eq(rowSubscript).find(".gameFrameCell").eq(upLineNum).addClass("active").html("");
							var upCell=$('<span class="color'+sellPiont[cellArrayActive[i]].power+'">'+sellPiont[cellArrayActive[i]].cellNum+'</span>');
							$(".gameFrameUl").eq(upRowNum).find(".gameFrameCell").eq(upLineNum).addClass("active").html(upCell);
							delete sellPiont[cellArrayActive[i]];
							delete cellObject[upCellnmu];
							return false;
						}
					}
				}else{
					if(upRowNum<=0){
						/*console.log("空空如也");*/
						/*方向端没有数据的时候开始移动*/
						sellPiont[upCellnmu]={};
						sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum;
						sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power;
						
						cellObject[cellArrayActive[i]]={};//排
						cellObject[cellArrayActive[i]].row=rowSubscript;//排
						cellObject[cellArrayActive[i]].line=upLineNum;//列
						/*页面上删除展示效果*/
						$(".gameFrameUl").eq(rowSubscript).find(".gameFrameCell").eq(upLineNum).addClass("active").html("");
						var upCell=$('<span class="color'+sellPiont[cellArrayActive[i]].power+'">'+sellPiont[cellArrayActive[i]].cellNum+'</span>');
						$(".gameFrameUl").eq(upRowNum).find(".gameFrameCell").eq(upLineNum).addClass("active").html(upCell);
						delete sellPiont[cellArrayActive[i]];
						delete cellObject[upCellnmu];
						return false;
					}else{
						createNewRow(upRowNum-1)
					}
					
					
				}
			}else{
				return false;
			}
		}
		/*方向端处理完毕之后，重新随机添加一个数据*/
		randomRendering();
	})
	/*下键事件*/
	$(".downBtn").bind("click",function(){
		if(!isStartGame){
			alert("你还没有开始游戏。")
			return false;
		}
		/*获取所有已存在的位置*/
		var cellArrayActive=Object.keys(sellPiont);
		/*对已有位置数据在对应方向上的比较 包括判断方向上是否存在其他块数据 是否能够相加，暴扣方向上最顶端处理之后中间是否留有空余位置用于二次移动但不靠口练习相加，
		 * 如果存在 2 2 4 ，前面两个2相加得4 这时两个4之间有一个空格，所以不能做相加处理，只能把后者4往方向端移动一步*/
		cellArrayActive.sort(function(a,b){
			return b-a;
		})//从大到小排序
		var cellArrayLen=cellArrayActive.length;
		for(var i = 0;i<cellArrayLen;i++){
			var rowSubscript=Math.floor(cellArrayActive[i]/10);//获取所在的排数，便于比较
			if(rowSubscript<3){
				var downRowNum=rowSubscript+1;
				var downLineNum=cellArrayActive[i]%10;
				createNewRow(downRowNum);
			}
		}
		function createNewRow(downRowNum){
			if(downRowNum<=3){
				var upCellnmu=downRowNum+""+downLineNum;//获取方向端前列的一个方块的坐标，用于判断是否有值 sellPiont[upCellnmu]==true 有值
				/*console.log(upCellnmu);*/
				if(sellPiont[upCellnmu]){
					
					/*邻近的方向端块有值*/
					if(sellPiont[upCellnmu].cellNum==sellPiont[cellArrayActive[i]].cellNum){
						/*如果方向位置有有数据且数据相同，则可以相加处理*/
						sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum*2;
						sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power+1;
						scoreNum=scoreNum+1;
						score(scoreNum);
						/*sellPiont[upCellnmu].power+=1;
						console.log(sellPiont[cellArray[i]].power);*/
						var upCell=$('<span class="color'+sellPiont[upCellnmu].power+'">'+sellPiont[upCellnmu].cellNum+'</span>');
						$(".gameFrameUl").eq(downRowNum).find(".gameFrameCell").eq(downLineNum).addClass("active").html(upCell);
						$(".gameFrameUl").eq(rowSubscript).find(".gameFrameCell").eq(downLineNum).addClass("active").html("");
						/*释放空格*/
						/*delete cellObject[sellPiont[cellArray[i]]];*/
						cellArrayActive.push(cellArrayActive[i]);
						cellObject[cellArrayActive[i]]={};//排
						cellObject[cellArrayActive[i]].row=rowSubscript;//排
						cellObject[cellArrayActive[i]].line=downLineNum;//列
						
						delete sellPiont[cellArrayActive[i]];
						return false;
					}else{
						downRowNum=downRowNum-1;
						upCellnmu=downRowNum+""+downLineNum;
						if(upCellnmu!=cellArrayActive[i]){
							/*方向端没有数据的时候开始移动*/
							/*console.log(upCellnmu);
							console.log(cellArrayActive[i]);*/
							
							/*方向端没有数据的时候开始移动*/
							sellPiont[upCellnmu]={};
							sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum;
							sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power;
							
							cellObject[cellArrayActive[i]]={};//排
							cellObject[cellArrayActive[i]].row=rowSubscript;//排
							cellObject[cellArrayActive[i]].line=downLineNum;//列
							/*页面上删除展示效果*/
							$(".gameFrameUl").eq(rowSubscript).find(".gameFrameCell").eq(downLineNum).addClass("active").html("");
							var upCell=$('<span class="color'+sellPiont[cellArrayActive[i]].power+'">'+sellPiont[cellArrayActive[i]].cellNum+'</span>');
							$(".gameFrameUl").eq(downRowNum).find(".gameFrameCell").eq(downLineNum).addClass("active").html(upCell);
							delete sellPiont[cellArrayActive[i]];
							delete cellObject[upCellnmu];
							return false;
						}
					}
				}else{
					if(downRowNum>=3){
						/*console.log("空空如也");*/
						/*方向端没有数据的时候开始移动*/
						sellPiont[upCellnmu]={};
						sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum;
						sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power;
						
						cellObject[cellArrayActive[i]]={};//排
						cellObject[cellArrayActive[i]].row=rowSubscript;//排
						cellObject[cellArrayActive[i]].line=downLineNum;//列
						/*页面上删除展示效果*/
						$(".gameFrameUl").eq(rowSubscript).find(".gameFrameCell").eq(downLineNum).addClass("active").html("");
						var upCell=$('<span class="color'+sellPiont[cellArrayActive[i]].power+'">'+sellPiont[cellArrayActive[i]].cellNum+'</span>');
						$(".gameFrameUl").eq(downRowNum).find(".gameFrameCell").eq(downLineNum).addClass("active").html(upCell);
						delete sellPiont[cellArrayActive[i]];
						delete cellObject[upCellnmu];
						return false;
					}else{
						createNewRow(downRowNum+1)
					}
					
					
				}
			}else{
				return false;
			}
		}
		/*方向端处理完毕之后，重新随机添加一个数据*/
		randomRendering();
	})

	/*左键事件*/
	$(".leftBtn").bind("click",function(){
		if(!isStartGame){
			alert("你还没有开始游戏。")
			return false;
		}
		/*获取所有已存在的位置*/
		var cellArrayActive=Object.keys(sellPiont);
		/*对已有位置数据在对应方向上的比较 包括判断方向上是否存在其他块数据 是否能够相加，暴扣方向上最顶端处理之后中间是否留有空余位置用于二次移动但不靠口练习相加，
		 * 如果存在 2 2 4 ，前面两个2相加得4 这时两个4之间有一个空格，所以不能做相加处理，只能把后者4往方向端移动一步*/
		cellArrayActive.sort(function(a,b){
			return a-b;
		})
		var cellArrayLen=cellArrayActive.length;
		for(var i = 0;i<cellArrayLen;i++){
			var lineSubscript=cellArrayActive[i]%10;//获取所在的列数，便于比较
			if(lineSubscript>0){
				var leftRowNum=Math.floor(cellArrayActive[i]/10);
				var leftLineNum=lineSubscript-1;
				createNewRow(leftLineNum);
			}
		}
		function createNewRow(leftLineNum){
			
			if(leftLineNum>=0){
				var upCellnmu=leftRowNum+""+leftLineNum;//获取方向端前列的一个方块的坐标，用于判断是否有值 sellPiont[upCellnmu]==true 有值
				/*console.log(upCellnmu);*/
				if(sellPiont[upCellnmu]){
					
					/*邻近的方向端块有值*/
					if(sellPiont[upCellnmu].cellNum==sellPiont[cellArrayActive[i]].cellNum){
						/*如果方向位置有有数据且数据相同，则可以相加处理*/
						sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum*2;
						sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power+1;
						scoreNum=scoreNum+1;
						score(scoreNum);
						/*sellPiont[upCellnmu].power+=1;
						console.log(sellPiont[cellArray[i]].power);*/
						var upCell=$('<span class="color'+sellPiont[upCellnmu].power+'">'+sellPiont[upCellnmu].cellNum+'</span>');
						$(".gameFrameUl").eq(leftRowNum).find(".gameFrameCell").eq(leftLineNum).addClass("active").html(upCell);
						$(".gameFrameUl").eq(leftRowNum).find(".gameFrameCell").eq(lineSubscript).addClass("active").html("");
						/*释放空格*/
						/*delete cellObject[sellPiont[cellArray[i]]];*/
						cellArrayActive.push(cellArrayActive[i]);
						cellObject[cellArrayActive[i]]={};//排
						cellObject[cellArrayActive[i]].row=leftRowNum;//排
						cellObject[cellArrayActive[i]].line=lineSubscript;//列
						
						delete sellPiont[cellArrayActive[i]];
						return false;
					}else{
						leftLineNum=leftLineNum+1;
						upCellnmu=leftRowNum+""+leftLineNum;
						if(upCellnmu!=cellArrayActive[i]){
							/*方向端没有数据的时候开始移动*/
							/*console.log(upCellnmu);
							console.log(cellArrayActive[i]);*/
							
							/*方向端没有数据的时候开始移动*/
							sellPiont[upCellnmu]={};
							sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum;
							sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power;
							
							cellObject[cellArrayActive[i]]={};//排
							cellObject[cellArrayActive[i]].row=leftRowNum;//排
							cellObject[cellArrayActive[i]].line=lineSubscript;//列
							/*页面上删除展示效果*/
							$(".gameFrameUl").eq(leftRowNum).find(".gameFrameCell").eq(lineSubscript).addClass("active").html("");
							var upCell=$('<span class="color'+sellPiont[cellArrayActive[i]].power+'">'+sellPiont[cellArrayActive[i]].cellNum+'</span>');
							$(".gameFrameUl").eq(leftRowNum).find(".gameFrameCell").eq(leftLineNum).addClass("active").html(upCell);
							delete sellPiont[cellArrayActive[i]];
							delete cellObject[upCellnmu];
							return false;
						}
					}
				}else{
					if(leftLineNum<=0){
						/*console.log("空空如也");*/
						/*方向端没有数据的时候开始移动*/
						sellPiont[upCellnmu]={};
						sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum;
						sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power;
						
						cellObject[cellArrayActive[i]]={};//排
						cellObject[cellArrayActive[i]].row=leftRowNum;//排
						cellObject[cellArrayActive[i]].line=lineSubscript;//列
						/*页面上删除展示效果*/
						$(".gameFrameUl").eq(leftRowNum).find(".gameFrameCell").eq(lineSubscript).addClass("active").html("");
						var upCell=$('<span class="color'+sellPiont[cellArrayActive[i]].power+'">'+sellPiont[cellArrayActive[i]].cellNum+'</span>');
						$(".gameFrameUl").eq(leftRowNum).find(".gameFrameCell").eq(leftLineNum).addClass("active").html(upCell);
						delete sellPiont[cellArrayActive[i]];
						delete cellObject[upCellnmu];
						return false;
					}else{
						createNewRow(leftLineNum-1)
					}
					
					
				}
			}else{
				return false;
			}
		}
		/*方向端处理完毕之后，重新随机添加一个数据*/
		randomRendering();
	})
	
	/*右键事件*/
	$(".rightBtn").bind("click",function(){
		if(!isStartGame){
			alert("你还没有开始游戏。")
			return false;
		}
		/*获取所有已存在的位置*/
		var cellArrayActive=Object.keys(sellPiont);
		/*对已有位置数据在对应方向上的比较 包括判断方向上是否存在其他块数据 是否能够相加，暴扣方向上最顶端处理之后中间是否留有空余位置用于二次移动但不靠口练习相加，
		 * 如果存在 2 2 4 ，前面两个2相加得4 这时两个4之间有一个空格，所以不能做相加处理，只能把后者4往方向端移动一步*/
		cellArrayActive.sort(function(a,b){
			return b-a;
		})
		var cellArrayLen=cellArrayActive.length;
		for(var i = 0;i<cellArrayLen;i++){
			var lineSubscript=cellArrayActive[i]%10;//获取所在的列数，便于比较
			if(lineSubscript<3){
				var rightRowNum=Math.floor(cellArrayActive[i]/10);
				var rightLineNum=lineSubscript+1;
				createNewRow(rightLineNum);
			}
		}
		function createNewRow(rightLineNum){
			
			if(rightLineNum<=3){
				var upCellnmu=rightRowNum+""+rightLineNum;//获取方向端前列的一个方块的坐标，用于判断是否有值 sellPiont[upCellnmu]==true 有值
				/*console.log(upCellnmu);*/
				if(sellPiont[upCellnmu]){
					
					/*邻近的方向端块有值*/
					if(sellPiont[upCellnmu].cellNum==sellPiont[cellArrayActive[i]].cellNum){
						/*如果方向位置有有数据且数据相同，则可以相加处理*/
						sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum*2;
						sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power+1;
						scoreNum=scoreNum+1;
						score(scoreNum);
						/*sellPiont[upCellnmu].power+=1;
						console.log(sellPiont[cellArray[i]].power);*/
						var upCell=$('<span class="color'+sellPiont[upCellnmu].power+'">'+sellPiont[upCellnmu].cellNum+'</span>');
						$(".gameFrameUl").eq(rightRowNum).find(".gameFrameCell").eq(rightLineNum).addClass("active").html(upCell);
						$(".gameFrameUl").eq(rightRowNum).find(".gameFrameCell").eq(lineSubscript).addClass("active").html("");
						/*释放空格*/
						/*delete cellObject[sellPiont[cellArray[i]]];*/
						cellArrayActive.push(cellArrayActive[i]);
						cellObject[cellArrayActive[i]]={};//排
						cellObject[cellArrayActive[i]].row=rightRowNum;//排
						cellObject[cellArrayActive[i]].line=lineSubscript;//列
						
						delete sellPiont[cellArrayActive[i]];
						return false;
					}else{
						rightLineNum=rightLineNum-1;
						upCellnmu=rightRowNum+""+rightLineNum;
						if(upCellnmu!=cellArrayActive[i]){
							/*方向端没有数据的时候开始移动*/
							/*console.log(upCellnmu);
							console.log(cellArrayActive[i]);*/
							
							/*方向端没有数据的时候开始移动*/
							sellPiont[upCellnmu]={};
							sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum;
							sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power;
							
							cellObject[cellArrayActive[i]]={};//排
							cellObject[cellArrayActive[i]].row=rightRowNum;//排
							cellObject[cellArrayActive[i]].line=lineSubscript;//列
							/*页面上删除展示效果*/
							$(".gameFrameUl").eq(rightRowNum).find(".gameFrameCell").eq(lineSubscript).addClass("active").html("");
							var upCell=$('<span class="color'+sellPiont[cellArrayActive[i]].power+'">'+sellPiont[cellArrayActive[i]].cellNum+'</span>');
							$(".gameFrameUl").eq(rightRowNum).find(".gameFrameCell").eq(rightLineNum).addClass("active").html(upCell);
							delete sellPiont[cellArrayActive[i]];
							delete cellObject[upCellnmu];
							return false;
						}
					}
				}else{
					if(rightLineNum>=3){
						/*console.log("空空如也");*/
						/*方向端没有数据的时候开始移动*/
						sellPiont[upCellnmu]={};
						sellPiont[upCellnmu].cellNum=sellPiont[cellArrayActive[i]].cellNum;
						sellPiont[upCellnmu].power=sellPiont[cellArrayActive[i]].power;
						
						cellObject[cellArrayActive[i]]={};//排
						cellObject[cellArrayActive[i]].row=rightRowNum;//排
						cellObject[cellArrayActive[i]].line=lineSubscript;//列
						/*页面上删除展示效果*/
						$(".gameFrameUl").eq(rightRowNum).find(".gameFrameCell").eq(lineSubscript).addClass("active").html("");
						var upCell=$('<span class="color'+sellPiont[cellArrayActive[i]].power+'">'+sellPiont[cellArrayActive[i]].cellNum+'</span>');
						$(".gameFrameUl").eq(rightRowNum).find(".gameFrameCell").eq(rightLineNum).addClass("active").html(upCell);
						delete sellPiont[cellArrayActive[i]];
						delete cellObject[upCellnmu];
						return false;
					}else{
						createNewRow(rightLineNum+1)
					}
					
					
				}
			}else{
				return false;
			}
		}
		/*方向端处理完毕之后，重新随机添加一个数据*/
		randomRendering();
	})
	
	
	/*修改分数*/
	function score(scoreNum){
		$(".score").html(scoreNum);
	}

})
