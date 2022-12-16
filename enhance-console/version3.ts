import traverse, { NodePath } from "@babel/traverse";
import generator from "@babel/generator";
import * as types from "@babel/types";
import { parse } from "@babel/parser";
import template from "@babel/template";

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

interface customNode extends types.CallExpression {
  isNew: Boolean
}

traverse(ast, {
  CallExpression(
    path: NodePath<customNode>,
    state
  ) {
    if (path.node.isNew) {
      return;
    }
    const curName = path.get("callee").toString();
    if (targetNames.includes(curName)) {
      const { line, column } = path.node.loc.start;
      const insertNode = template.expression(
        `console.log('filename: ${line}, ${column}')`
      )() as customNode;
      insertNode.isNew = true;
      if (path.findParent((p) => p.isJSXElement())) {
        path.replaceWith(types.arrayExpression([insertNode, path.node]));
        path.skip()
      } else {
        path.insertBefore(insertNode);
      }
    }
  },
});

const { code } = generator(ast);

console.log(code);
