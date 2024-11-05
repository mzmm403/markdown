## less介绍
- [less中文文档](https://less.xiniushu.com/)

- less： less是css的预处理语言。除了less，还有scss(sass)、stylus这些预处理语言。将css赋予了动态语言的特性，如变量、继承、运算、函数等，让css更加易维护和扩展。

- css预处理语言编写css，浏览器不认识，所以需要首先编译成纯css，需要使用工具进行编译(如命令行工具/gulp/webpack等)

- 全局安装less编译器
    ```bash
    npm i -g less
    ```

- 安装项目依赖
    ```bash
    npm i -D less
    ```

- 编译less文件
    ```bash
    lessc index.less index.css 
    ```


## less语法

### 变量

> 变量声明和使用

```less
// @var: value;
@color: red;

// 使用就是整体作为一个变量名直接使用
.box{
    background: @color;
}
```


### 嵌套

> 提供了使用嵌套(nesting)代表层叠或与层叠结合使用的能力

```less
// 例如有这样的html结构
<div class="box">
    <div class="title"></div>
    <div class="content"></div>
</div>

// css
.box{
    .title{
        color: red;
    }
    .content{
        color: blue;
    }
}
```

> 在嵌套中，`&`代表父元素

```less
.box{
    .title{
        color: red;
    }
    .content{
        color: blue;
    }
    // 这里的&代表.box
    &:hover{
        color: green;
    }
    &:after{
        content: "&的用法"
    }
}
```


### 混合

> 声明的集合，使用时直接键入名称即可

- 固定值集合

```less
// 声明圆角效果
.radius(){
    border: 1px solid pink;
    margin: 20px;
    border-radius: 4px;
}

// 使用圆角效果
.box{
    .radius();
}
```

- 变量集合

```less
.radius(@a, @b){
    border: 1px solid pink;
    margin: @b;
    border-radius: @a;
}

// 使用圆角效果
.box{
    .radius(4px, 20px);
}
```

### 继承

> extend是Less的一个伪类。它可继承所匹配声明中的全部样式

- extend关键字的使用

```less
.animation{
    transition:all .3s ease-out;
    .hide{
        transform:scale(0);
    }
}

#main{
    &:extend(.animation);
}

#con{
    &:extend(.animation .hide);
}

// 这里的继承extends可以直接用混合去替代
#con{
    .animation .hide;
}
```

- all关键字的使用

> 使用选择器匹配到的全部声明(extend继承只能继承你选中层级的样式，子级的样式不会继承，而使用all则全部继承)

```less
#main{
    width: 100px;
}

#main{
    &:after{
        content: "all关键字的使用";
    }
}

#wrap:extend(#main all){}
```


### 导入

> 允许在一个less文件中引入其他的less或者css文件

```less
// 导入css文件需要加css后缀
@import 'styles.css';
// 导入less文件不需要加后缀，只需要路径即可
@import 'styles';
```


### 函数

> less提供了很多函数，可以方便我们使用

- isnumber

> 做类型判断的,判断是否是一个数字的

```less
// false
isnumber(#ff0);
// false   
isnumber(blue);
// false   
isnumber("string");
// true  
isnumber(1234); 
// true  
isnumber(56px);
// true   
isnumber(7.8%); 
// false  
isnumber(keyword); 
// false 
isnumber(url(...)); 
```
**颜色操作**
- iscolor：做类型判断的,判断是否是一个颜色
- isurl：做类型判断的,判断是否是一个url
- Saturate：增加一定数值的颜色饱和度
- Lighten：增加一定数值的颜色亮度
- Darken：降低一定数值的颜色亮度
- Fade：给颜色设定一定数值的透明度
- Mix：根据比例混合两种颜色

**数学函数**
- Ceil：向上取整
- Floor：向下取整
- Percentage：将浮点数转换为百分比格式
- Round：四舍五入
- Sqrt：计算一个数的平方根
- Abs：计算数字的绝对值，原样保持单位
- Pow：计算一个数的乘方


### 循环

> less没有直接提供for循环功能，但是可以通过递归函数实现循环

```less
.generate-columns(4);
.generate-columns(@n, @i: 1) when (@i =< @n) {
  .column-@{i} {
    width: (@i * 100% / @n);
  }
  .generate-columns(@n, (@i + 1));
}
```