# GA-BestRoute
网页端遗传算法的实现  
use genetic algorithm to find the best route on web  

网页截图如下  
the snapshot of the website:  
![image](https://github.com/chenhuaizhen/GA-BestRoute/raw/master/image/1.jpg)
![image](https://github.com/chenhuaizhen/GA-BestRoute/raw/master/image/2.jpg)

网页中的灰色部分可以通过点击来增加点（即货物），而最终的目标是找到一条最短路径来搜集所有点（货物），起点是左上角，终点也是左上角  
you can click on the gray area to add dots(goods) and the goal is to find out the shortest route to collect all dots(goods), the starting point is the top left corner, the same as the terminal point  

或者可以在输入框中填入点（货物）的总数，然后点击生成  
or you can just enter the total number of the dots(goods) in the input box and click the upper button  

点（货物）生成效果如下：  
the image of the dots(goods) as below:  
![image](https://github.com/chenhuaizhen/GA-BestRoute/raw/master/image/3.jpg)

然后点击生成，即可生成一条较优（无法确定最优）路线，其用直线连接起来  
then click the second button you can see a generated route which is shown in lines, it should be noted that the route is not the shortest way but a better way based on the time and the number of the dots  
![image](https://github.com/chenhuaizhen/GA-BestRoute/raw/master/image/4.jpg)

下图是具体的路径规划，从上到下分别是经过点的坐标，以起点为坐标原点    
the following image is the specific route that shows the whole coordinates from the starting point(which is the origin) to the terminal  
![image](https://github.com/chenhuaizhen/GA-BestRoute/raw/master/image/5.jpg)

下图是遗传算法的迭代过程，同一横坐标上不同的y值代表一次迭代中一个族类里不同个体（路径规划方案）的价值（总距离），y值越大越优，代表距离越短  
the following image is the performance of the algorithm, based on the same x-axis's value, different y values mean different distances of different routes in the cluster(one cluster may have 100 kinds of routes), the value of y is the bigger the better  
![image](https://github.com/chenhuaizhen/GA-BestRoute/raw/master/image/6.jpg)

另外，只有点数大于10个才会进行遗传算法，否则采用穷举搜索
What's more, only when the number of the points over 10 would use Genetic Algorithm, otherwise use Exhaustive Attack method

遗传算法实现位置  
the position of the genetic algorithm in main.js  
[Genetic Algorithm](https://github.com/chenhuaizhen/GA-BestRoute/blob/master/main.js#L151 "code")

另附穷举法位置  
the position of the Exhaustive Attack method in main.js  
[Exhaustive Attack method](https://github.com/chenhuaizhen/GA-BestRoute/blob/master/main.js#L378 "code")

还有贪婪算法  
and the Greedy Algorithm  
[Greedy Algorithm](https://github.com/chenhuaizhen/GA-BestRoute/blob/master/main.js#L351 "code")