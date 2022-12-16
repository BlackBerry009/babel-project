import Babel, {
  NodePath,
  PluginObj,
  PluginPass,
  types as t,
} from "@babel/core";

interface customNode extends t.CallExpression {
  isNew: Boolean;
}

const targetNames = ["log", "error", "debug", "info"].map(
  (item) => `console.${item}`
);

export default ({ types, template }: typeof Babel): PluginObj => {

  return {
    name: "my-babel-plugin",
    visitor: {
      CallExpression(path: NodePath<customNode>, state) {
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
            path.skip();
          } else {
            path.insertBefore(insertNode);
          }
        }
      },
    },
  };
};
