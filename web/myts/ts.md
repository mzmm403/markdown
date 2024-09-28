# ts基础语法学习



## 关于变量类型的三种方式



### 类型推断

> 就是ts底层会在你第一次赋值给某个变量时，推断并给予这个变量的类型

```ts
// 类型推断
let string = "abc"
string = 10
// 或者
let string = "abc"
let num = 10
string = num

// 上述就是错误的写法，这里因为第一次赋值给string是自负床类型因此ts就固定了string的类型为字符串，所以后续赋值的时候不可以给string赋值非字符串的值或是变量
```





### 类型注解

> 其实就是对变量进行类型限定，也就是强语言中对于变量类型的声明

```ts
// 给变量的类型进行一个手动声明(类型注解)
let str: string = "abc"
let str1: string

str1 = 'abc'
```



### 类型断言

> 就是程序在推断的时候会推断出undefined类型，如果我们能确定这个值的类型是必然的，就可以手动断言.

```ts
// 错误示范,res此时是undefined
let numArr = [1,2,3]
const res = numArr.find(item => item>3)
res * 5


// 正确写法
let numArr = [1,2,3]
const res = numArr.find(item => item>3) as number
res * 5
```



## 数据类型

### 基础类型和联合类型

```ts
// 基础类型
let v1: string = "abc"
let v2: number = 10
let v3: boolean = true
let nu: null = null
let un: undefined = undefined


// 联合类型
let v4: string | null = null
let v5: 1 | 2 | 3 = 2
```



### 数组、元组、枚举

```ts
// 数组
let arr: number[] = [1,2,3]
let arr1: Array<string> = ['a','b','c']

// 元组
let t1: [number,string,number] = [1,'2',3]
// 加了问号以后就变成了可选项
let t2: [number,string,number?] = [1,'2']

// 枚举
enum MyEnum {
    A,
    B,
    C
}

console.log(MyEnum.A)
console.log(MyEnum[0])
```



### 函数

```ts
// 函数的定义
function MyFn (a: number, b: string): string{
    return a+b
}
// void空返回值，这里void其实就是undefined
function MyFn1 (a: number, b: string): void{
    a+b
}
// 可选参数，给参数设置默认值，可变参数
function MyFn2 (a = 10,b: string, c? :boolean, ...rest: number[]): number{
    return 100
}

const f = MyFn2(20,'abc',1,2,3,)
```

### 类

```ts
class Article {
    title: string
    content: string
    aaa?: string
    // 默认值
    bbb = 100 
    
    // 构造函数
    constructor (title: string, content:string){
        this.title = title,
        this.content = content
    }
}

const a = new Article('标题','内容')
```



### 接口

```ts
// 定义接口
interface Obj{
    name: string,
    age: number
}

const obj: Obj = {
    name: "a",
    age: 10
}
```



### 类型别名

```ts
type MyUserName = string | number
let a: MyUserName = 10
let b: MyuserName = 'abc'
```





### 泛型

```ts
function myFn<T>(a:T,b:T): T[]{
    return [a,b]
}

myFn<number>(1,2)
// 这样不声明也行，ts会有一个类型推断
myFn("a","b")
```



# ts的高级用法

## 函数重载

> 函数重载的优点在于提高了代码的灵活性、可读性和类型安全性.重载确保了函数的接口更加明确，并且在开发过程中提供了更好的类型检查和错误检测。

```ts
// eg1:
function map<T>(array: T[], callback: (item: T) => T): T[];
function map<T, U>(array: T[], callback: (item: T) => U): U[];
function map<T, U>(array: T[], callback: (item: T) => T | U): (T | U)[] {
    return array.map(callback);
}

// eg2:
interface Vector2D {
    x: number;
    y: number;
}

function add(a: number, b: number): number;
function add(a: Vector2D, b: Vector2D): Vector2D;
function add(a: number | Vector2D, b: number | Vector2D): number | Vector2D {
    if (typeof a === 'number' && typeof b === 'number') {
        return a + b;
    } else if (typeof a !== 'number' && typeof b !== 'number') {
        return { x: a.x + b.x, y: a.y + b.y };
    }
    throw new Error('Invalid arguments');
}


```



## 接口的继承

```ts
interface Parent {
    prop1: string
    prop2: number
}

interface Chlid extends Parent {
    prop3: string[]
}

const myObj: Chlid = {
    prop1: 'abc',
    prop2: 12,
    prop3: ["1","2"]
}
```



## 类的修饰符

```ts
class Article {
    // 默认public
    title: string
    public content: string
    
    // 私有属性,只能在类中访问
    private tempData?: string
    // 受保护属性,只能在当前类和子类中访问
    protected innerData?: string
    // 静态属性,设置给类本本身的
    static author: string
    // 只读
    readonly age: number = 18

    // 构造函数
    constructor (title: string, content:string){
        this.title = title,
        this.content = content
    }
}

const a = new Article('标题','内容')
//静态类访问
Article.author

// innerData的访问
class B extends Article {
    constructor (title: string, content:string) {
        super(title,content)
        this.innerData
    }
}
```





## 存储器

```ts
class User {
    // 私有变量建议加一个下划线命名
    private _password: string = ''
	
	// 获取密码
	get password(): string{
        return '******'
    }
	// 设置密码
	set password(newPass: string){
        this._password = newPass
    } 
}

const u = new User()
console.log(u.password)
```



## 抽象类

```ts
abstract class Animal{
    abstract name: string
    abstract Sound(): void
    // 具体的属性和方法可以直接被继承
    move (): void {
        console.log("移动")
    }
}

class Horse extends Animal {
    name: string = "小马"
    Sound(): void{
        console.log("吁~~~")
    }
}
```



## 类实现接口

```ts
interface Animal {
    name: string
    get sound(): string
    Sound():void
}

interface B {
    age: number
}

class Dog implements Animal,B {
    name: string = "小狗"
    age: number = 10
    get sound(){
        return ''
    }
    Sound(): void{
        
    }
}
```



## 泛型类

```ts
class MyClass<T> {
    public value: T
    constructor (value: T){
        this.value = value
    }
    
    do (input: T): T{
        console.log("处理数据",this.value)
        return input
    }
}


const myStr = new MyClass<string>("hello")
myStr.do("nihao")
```

