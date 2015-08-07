# treeframe [![spm version](http://spmjs.io/badge/treeframe)](http://spmjs.io/package/treeframe)

---

Spider 在设置数据源之后，会将数据转换成 `Frame`， 一个数据集合包括以下部分

1. dataFrame : 数据源的集合
2. treeSet / netSet : 结构化的数据。

frame 在选择行、列，形成新的frame之后，也会形成相应的 treeSet 和 netSet 。

```javascript
var data  = [
	{"id":"85","strategyId":9010,"text":"收银台错误日志(85)"},
	{"id":"86","strategyId":9010,"parent":"51","text":"支付推进处理日志(86)"},
	{"id":"77","strategyId":9010,"parent":"76","text":"完成支付失败包含积分详细信息(77)"},
	{"id":"60","strategyId":9010,"parent":"53","text":"阶段充值回执信息有无(60)"},
	{"id":"61","strategyId":9010,"parent":"60","text":"阶段充值回执信息结果(61)"},
	{"id":"65","strategyId":9010,"parent":"61","text":"抓取充值回执错误码(65)"},
	{"id":"66","strategyId":9010,"parent":"65","text":"分流回执错误信息(66)"}
];


var treeFrame = new TreeFrame(data);
var treeSet = treeFrame.treeSet;

console.log(">> treeFrame.data:", treeFrame.dataFrame);
console.log(">> treeFrame.treeSet:", treeSet);

console.log(">> 树的全部节点:", treeSet.getNodes());
console.log(">> 树的根节点:", treeSet.getRoots())
console.log(">> 树的叶节点:", treeSet.getLeaf());
console.log(">> 选择一个节点:", treeSet.select({id: "86"}));

var n = treeSet.select("86");
console.log(">> 选择节点n的兄弟节点:", treeSet.siblings(n));
console.log(">> 选择节点n的祖先节点:", treeSet.getAncestor(n));
console.log(">> 选择节点n的子孙节点:", treeSet.getDescendant(n));
console.log("=========");
//指定字段名:
var nframe = new TreeFrame(data, {
	names : ['strategyId']
});

console.log(">> 指定字段Id.data", nframe.dataFrame);
console.log(">> 指定字段Id.treeSet", nframe.treeSet);

console.log("===========");
var cframe = treeFrame.cols(['strategyId']);
console.log(">>由frame生成新集合.data", cframe.dataFrame);
console.log(">> 由frame生成新集合.treeSet", cframe.treeSet);

console.log("======");
console.log(">> colArray", treeFrame.colArray('strategyId'));

```
## Install

```
$ spm install treeframe --save
```

## Usage

```js
var treeframe = require('treeframe');
// use treeframe
```
