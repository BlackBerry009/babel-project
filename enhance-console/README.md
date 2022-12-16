# README

给每个 console 添加额外信息

version1： 用最底层的方法 

version2： 用二次封装的方法进行简化  

version3： 在原 console 的上方添加，与之前解耦。
> tips
> 
> 在 jsx 中，因为只有一个根节点，所有要用表达式包裹，不能直接使用 `insertBefore` api。
> 所以需要对这个内容进行替换，而且替换完成之后还需要 `skip`，因为替换完的代码也是 console.xx，即也是CallExpression，所以防止堆栈溢出。

version4： 封装为可用的 plugin