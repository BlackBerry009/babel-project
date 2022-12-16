import traverse from "@babel/traverse";
import generator from "@babel/generator";
import * as types from "@babel/types";
import { parse } from "@babel/parser";

const sourceCode = `
console.log(1);

function func() {
    console.info(2);
}

export default class Clazz {
    say() {
        console.debug(3);
    }
    render() {
      return <div>{console.error(4)}</div>
  }
}
`;

const ast = parse(sourceCode, {
  sourceType: "unambiguous",
  plugins: ["jsx"],
})!;

const targetNames = ["log", "error", "debug", "info"].map(
  (item) => `console.${item}`
);

traverse(ast, {
  CallExpression(path, state) {
    // generator 将 AST 生成代码，即 console.xxx
    // 或者通过 path 的 toString 方法直接生成
    const curName = generator(path.node.callee).code;
    // const curName = path.get('callee').toString()
    if (targetNames.includes(curName)) {
      const { line, column } = path.node.loc.start;
      path.node.arguments.unshift(
        types.stringLiteral(`filename: (${line}, ${column})`)
      );
    }
  },
});

const { code } = generator(ast);

console.log(code);
