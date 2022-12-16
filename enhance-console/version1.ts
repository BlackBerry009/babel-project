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

traverse(ast, {
  CallExpression(path, state) {
    if (
      types.isMemberExpression(path.node.callee) &&
      (path.node.callee.object as types.Identifier).name === "console" &&
      ["log", "error", "debug", "info"].includes(
        (path.node.callee.property as types.Identifier).name
      )
    ) {
      const { line, column } = path.node.loc.start || {};
      path.node.arguments.unshift(
        types.stringLiteral(`filename: (${line}, ${column})`)
      );
    }
  },
});

const { code } = generator(ast);

console.log(code);
