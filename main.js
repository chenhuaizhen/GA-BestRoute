var ctx;
var canvas;
var canvasChart;
var ctxChart;
var array = new Array();
var group = new Array();
var M = 200;
var pgroup = new Array();
var pMix = 0.8;
var pChange = 0.02;
var Generation = 1000;
var resultGroup = new Array();
var MAX;
var MIN;

function unit(x,y){
    this.array = x;
    this.value = y;
}

function city(x,y){
    this.x = x;
    this.y = y;
}

function drawO(e) {
    var x = e.layerX;
    var y = e.layerY;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(148,0,0,0.25)';
    ctx.fill();
    array.push(new city(x,y));
}

function drawChartO(){
    //var max = resultGroup[0];
    var min = resultGroup[0];
    for(var i=1;i<resultGroup.length;i++){
        //if(max<resultGroup[i])
            //max=resultGroup[i];
        if(min>resultGroup[i])
            min=resultGroup[i];
    }
    MIN = min;
    //ctxChart.beginPath();
    //ctxChart.strokeStyle = "rgba(148,0,0,0.25)";
    //ctxChart.fillStyle = "rgba(148,0,0,0.25)";
    //ctxChart.lineTo(0, 500);
    for(var i=0;i<resultGroup.length;i++){
    	//var resMax = resultGroup[i];
    	//var resMin = resultGroup[i];
    	//for(var j=i;j<i+M;j++){
	    //    if(resMax<resultGroup[j])
        //    	resMax=resultGroup[j];
        //	if(resMin>resultGroup[j])
        //    	resMin=resultGroup[j];
    	//}
    	ctxChart.beginPath();
    	ctxChart.arc(1000/resultGroup.length*i, 500-(resultGroup[i]-min)*500/(MAX-min), 1, 0, Math.PI * 2, true);
    	ctxChart.closePath();
    	ctxChart.fillStyle = 'rgba(148,0,0,0.25)';
    	ctxChart.fill();
    	//ctxChart.moveTo(1000/resultGroup.length*i, 500-(resMin-min)*500/(MAX-min));
        //ctxChart.lineTo(1000/resultGroup.length*i, 500-(resMax-min)*500/(MAX-min));
    }
    //ctxChart.stroke();
}

function init(){
    canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
    canvasChart = document.getElementById('canvasChart');
    ctxChart = canvasChart.getContext('2d');
    canvas.addEventListener('mousedown',drawO,false);
}

function drawL(){
    ctx.beginPath();
    ctx.strokeStyle = "rgba(148,0,0,0.25)";
    ctx.fillStyle = "rgba(148,0,0,0.25)";
    ctx.lineTo(0, 0);
    for (var i = 0; i < array.length ; i++) {
        ctx.lineTo(array[i].x, array[i].y);
    }
    ctx.lineTo(0, 0);
    ctx.stroke();
}

$(document).ready(function(){
    init();
});

function initGroup(){
    group.push(new unit(array,getValue(array)));
    for(var i=0;i<M-1;i++){
        var temp = array.slice(0);
        temp.sort(function(){ return 0.5 - Math.random();});
        group.push(new unit(temp,getValue(temp)));
    }
}

function getValue(g){
	var times = 1;
    var value = Math.sqrt(g[0].x*times*g[0].x*times+g[0].y*times*g[0].y*times);
    for(var i=1;i<g.length;i++){
        value += Math.sqrt((g[i].x-g[i-1].x)*times*(g[i].x-g[i-1].x)*times+(g[i].y-g[i-1].y)*times*(g[i].y-g[i-1].y)*times);
    }
    value += Math.sqrt(g[g.length-1].x*times*g[g.length-1].x*times+g[g.length-1].y*times*g[g.length-1].y*times);
    return 1/value;
}

function getAllValue(){
    var val = 0;
    for (var i = group.length - 1; i >= 0; i--) {
        val += group[i].value;
    }
    pgroup[0] = group[0].value/val;
    for(var i=1;i<group.length;i++){
        pgroup.push(pgroup[pgroup.length-1]+group[i].value/val);
    }
}

function quicksort(g,first,end){
    var i = first;
    var j = end;
    var temp = g[first];
    while(i<j){
        while(i<j&&g[j].value <= temp.value)
            j--;
        g[i] = g[j];
        while(i<j&&g[i].value >= temp.value)
            i++;
        g[j] = g[i];
    }
    g[i] = temp;
    if(first < i-1)
        quicksort(g,first,i-1);
    if(end > i+1)
        quicksort(g,i+1,end);
}

function inArray(arrayX,arrayY){
    for(var i=0;i<arrayY.length;i++)
        if(arrayX.x==arrayY[i].x&&arrayX.y==arrayY[i].y)
            return i;
    return -1;
}

function evolution(){
    var evol = new Array();
    var judge = new Array();
    for(var i=0;i<M;i++){
        judge.push(1);
    }
    for(var i=0;i<M*0.5;i++){
        var ran = Math.random()*0.6;
        for(var j=pgroup.length-1;j>=0;j--){
            if(pgroup[j]<ran){
                if(judge[j+1]==1){
                    evol.push(j+1);
                    judge[j+1]=0;
                    break;
                }
            }
        }
    }
    judge = [];
    var p = Math.random();
    if(p<pMix){
        for(var ii=0;ii<M*pMix*0.5;ii++){
            var a = Math.floor(Math.random()*evol.length);
            var b = Math.floor(Math.random()*evol.length);
            while(a==b)
                b = Math.floor(Math.random()*evol.length);
            var x = Math.floor(Math.random()*group[evol[a]].array.length);
            var y = Math.floor(Math.random()*group[evol[a]].array.length);
            while(x==y)
                y = Math.floor(Math.random()*group[evol[a]].array.length);
            var begin = x<y?x:y;
            var end = x+y-begin;
            var p1 = group[evol[a]].array.slice(begin,end);
            var p2 = group[evol[b]].array.slice(begin,end);
            for(var i=0;i<p2.length;i++){
                var index = inArray(p2[i],group[evol[a]].array);
                if(index>=0)
                    group[evol[a]].array.splice(index,1);
            }
            for(var i=0;i<p1.length;i++){
                var index = inArray(p1[i],group[evol[b]].array);
                if(index>=0)
                    group[evol[b]].array.splice(index,1);
            }
            for(var i=p2.length-1;i>=0;i--)
                group[evol[a]].array.splice(begin,0,p2[i]);
            for(var i=p1.length-1;i>=0;i--)
                group[evol[b]].array.splice(begin,0,p1[i]);
        }    
    }
    if(p<pChange){
        for(var i=0;i<M*pChange;i++){
            var changeIndex = Math.floor(Math.random()*group.length);
            var delTab = getValue(group[changeIndex].array);
            var changeX = Math.floor(Math.random()*group[changeIndex].array.length);
            var changeY = Math.floor(Math.random()*group[changeIndex].array.length);
            while(changeX==changeY)
                changeY = Math.floor(Math.random()*group[changeIndex].array.length);
            var temp = group[changeIndex].array[changeX];
            group[changeIndex].array[changeX] = group[changeIndex].array[changeY];
            group[changeIndex].array[changeY] = temp;
            if(getValue(group[changeIndex].array)<delTab){
            	group[changeIndex].array[changeY] = group[changeIndex].array[changeX];
            	group[changeIndex].array[changeX] = temp;
            }
        }
    }
    evol = [];
}

function run(){
    if(array.length<=10){
        savage(0);
        array = savageRes.slice(0);
    	MAX = getValue(array);
        drawL();
        AddTable();
        return;
    }
    initGroup();
    var max = group[0].value;
    var k = 0;
    for(var i=0;i<M;i++){
    	resultGroup.push(group[i].value);
        if(max<group[i].value){
            max = group[i].value;
            k = i;
        }
    }
    //resultGroup.push(max);
    
    MAX = max;
    array = group[k].array.slice(0);
    var flawNumber = 0;
    var flawFlag = 0;
    for(var i=0;i<Generation;i++){
        pgroup = [];
        quicksort(group,0,group.length-1);
        getAllValue();
        evolution();
        for(var j=0;j<M;j++)
            group[j].value = getValue(group[j].array);
        max = group[0].value;
        k = 0;
        for(var j=0;j<M;j++){
        	resultGroup.push(group[j].value);
            if(max<group[j].value){
                max = group[j].value;
                k = j;
            }
        }
        if(flawFlag == max)
        	flawNumber++;
        else
        	flawNumber = 0;
        flawFlag = max;
        //resultGroup.push(max);
        if(max>MAX){
            MAX = max;
            array = group[k].array.slice(0);
        }
        if(flawNumber>Generation/5){
        	/*group = [];
        	flawNumber = 0;
        	array.sort(function(){ return 0.5 - Math.random();});
        	initGroup();*/
        	quicksort(group,0,group.length-1);
        	for(var ii=group.length-1;ii>group.length*0.1;ii-=2){
        		var a = Math.floor(Math.random()*group.length*0.1);
            	while(a==0)
                	a = Math.floor(Math.random()*group.length*0.1);
	            var x = Math.floor(Math.random()*array.length);
	            var y = Math.floor(Math.random()*array.length);
	            while(x==y)
	                y = Math.floor(Math.random()*array.length);
	            var begin = x<y?x:y;
	            var end = x+y-begin;
	            var p1 = group[a].array.slice(begin,end);
	            var p2 = group[0].array.slice(begin,end);
	            group[ii].array = group[a].array.slice(0);
	            group[ii-1].array = group[0].array.slice(0);
	            for(var iii=0;iii<p1.length;iii++){
	                var index = inArray(p1[iii],group[ii-1].array);
	                if(index>=0)
	                    group[ii-1].array.splice(index,1);
	            }
	            for(var iii=p1.length-1;iii>=0;iii--)
	                group[ii-1].array.splice(begin,0,p1[iii]);
	            group[ii-1].value = getValue(group[ii-1].array);
	            for(var iii=0;iii<p2.length;iii++){
	                var index = inArray(p2[iii],group[ii].array);
	                if(index>=0)
	                    group[ii].array.splice(index,1);
	            }
	            for(var iii=p2.length-1;iii>=0;iii--)
	                group[ii].array.splice(begin,0,p2[iii]);
	            group[ii].value = getValue(group[ii].array);
        	} 
        	flawNumber = 0;  
        }
    }
    $('#bigcon').css('display','block');
    drawL();
    AddTable();
    drawChartO();
    var string = "<p>"+FormatAfterDotNumber(1/MAX,8)+"</p><p>最优值</p><p>"+FormatAfterDotNumber(1/MIN,8)+"</p>";
    $('#hideXY').append(string);
}

function AddTable(){
    var string = "<table class=\"default\" width=\"100%\"><col width=\"50%\"><col width=\"50%\">"+
                    "<tr class=\"title\"><td>顺序</td><td>货物坐标</td></tr>";
    for(var i=0;i<array.length;i++){
        string += "<tr class=\"list\"><td>"+i+"</td><td>"+array[i].x+","+array[i].y+"</td></tr>";
    }    
    string += "<tr class=\"list\"><td>路径消耗最少为</td><td>"+1/MAX+"</td></tr>";
    string += "</table>";
    $('#table').append(string);
}

function drawOO(x,y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = 'rgba(148,0,0,0.25)';
    ctx.fill();
    array.push(new city(x,y));
}

function initO(){
    array = [];
    ctx.clearRect(0,0,1000,500);
    var sum = $('#text').val();
    for(var i=0;i<sum;i++){
        var x = Math.random()*1000;
        var y = Math.random()*500;
        drawOO(x,y);
    }
}

function Dynamic(){
    var res = new Array();
    var length = array.length;
    for(var j = 0;j<length;j++){
        var val = 10000;
        var k = 0;
        for(var i=0;i<array.length;i++){
            var val2;
            if(res.length==0)
                val2 = Math.sqrt(array[i].x*array[i].x+array[i].y*array[i].y);
            else
                val2 = Math.sqrt((array[i].x-res[res.length-1].x)*(array[i].x-res[res.length-1].x)+(array[i].y-res[res.length-1].y)*(array[i].y-res[res.length-1].y));
            if(val>val2){
                val = val2;
                k = i;
            }
        }
        res.push(array[k]);
        array.splice(k,1);
    }
    array = res.slice(0);
    MAX = getValue(array);
}

var savageMin = 100000;
var savageArray = new Array();
var savageRes = new Array();
function savage(savageCur){ 
	var i,j;  
	if(savageCur==array.length)
	{  
	    if(1/getValue(savageArray)<savageMin){
	    	savageRes = savageArray.slice(0); 
	    	savageMin = 1/getValue(savageRes);
	    }
	}  
	else  
	{  
	    for(i=0;i<array.length;i++)
	    {  
	        var ok=true;  
	        for(j=0;j<savageCur;j++)  
	        	if(savageArray[j]==array[i])
	        	{  
	        	    ok=false;  
	        	    break;  
	        	}  
	        if(ok)  
	        {  
	            savageArray[savageCur]=array[i];  
	            savage(savageCur+1);
	        }  
	    }  
	}  
}

function FormatAfterDotNumber( ValueString, nAfterDotNum )
{
    var ValueString,nAfterDotNum ;
　　var resultStr,nTen;
　　ValueString = ""+ValueString+"";
　　strLen = ValueString.length;
　　dotPos = ValueString.indexOf(".",0);
　　if (dotPos == -1)
        {
　　　　resultStr = ValueString+".";
　　　　for (i=0;i<nAfterDotNum ;i++)
                {
　　　　　　resultStr = resultStr+"0";
　　        }
　　　　return resultStr;
　　}
　　else
        {
　　　　if ((strLen - dotPos - 1) >= nAfterDotNum ){
　　　　　　nAfter = dotPos + nAfterDotNum  + 1;
　　　　　　nTen =1;
　　　　　　for(j=0;j<nAfterDotNum ;j++){
　　　　　　　　nTen = nTen*10;
　　　　　　}
　　　　　　resultStr = Math.round(parseFloat(ValueString)*nTen)/nTen;
　　　　　　return resultStr;
　　　　}
　　　　else{
　　　　　　resultStr = ValueString;
　　　　　　for (i=0;i<(nAfterDotNum  - strLen + dotPos + 1);i++){
　　　　　　　　resultStr = resultStr+"0";
　　　　　　}
　　　　　　return resultStr;
　　　　}
　　}
} 

function demo1()//路径消耗最少为2388.423221087048
{
	array.push(new city(574.293062782301,227.64069873267067));
	array.push(new city(329.07186990771265,113.2339986781975));
	array.push(new city(193.25359345918193,25.33405424923729));
	array.push(new city(243.39271339381295,157.9042201541725));
	array.push(new city(219.7994813657209,97.38719653905525));
	array.push(new city(127.33552283897897,77.43548712842463));
	array.push(new city(235.96152517352408,271.42902213242513));
	array.push(new city(123.60468192626107,427.0853529414738));
	array.push(new city(776.9822346942881,71.08881713096405));
	array.push(new city(341.6591744124857,36.42380944621881));
	array.push(new city(790.3637289567887,274.3229488260348));
	ctx.clearRect(0,0,1000,500);

    for(var i=0;i<array.length;i++){
	    ctx.beginPath();
    	ctx.arc(array[i].x, array[i].y, 5, 0, Math.PI * 2, true);
    	ctx.closePath();
    	ctx.fillStyle = 'rgba(148,0,0,0.25)';
    	ctx.fill();
    }
}

function demo2()//路径消耗最少为2786.191205465833
{
	array.push(new city(925.4994920373388,120.02848879977324));
	array.push(new city(112.17667137409481,457.61003520698205));
	array.push(new city(253.0595217012388,205.1335666152768));
	array.push(new city(913.7761155333939,320.9351399504744));
	array.push(new city(188.28482253906787,20.019663190867675));
	array.push(new city(508.9940542223814,159.72245485330072));
	array.push(new city(410.70582475929587,246.6048203131459));
	array.push(new city(680.4688922080311,439.2807429203962));
	array.push(new city(999.3599297827726,395.07176821160215));
	array.push(new city(358.6702516953633,247.0142073553365));
	array.push(new city(48.98700832290848,365.64826103315215));
	ctx.clearRect(0,0,1000,500);

    for(var i=0;i<array.length;i++){
	    ctx.beginPath();
    	ctx.arc(array[i].x, array[i].y, 5, 0, Math.PI * 2, true);
    	ctx.closePath();
    	ctx.fillStyle = 'rgba(148,0,0,0.25)';
    	ctx.fill();
    }
}