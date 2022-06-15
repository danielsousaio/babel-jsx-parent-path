import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

describe("JSX parentPath behavior", function () {
  const code = `
    const Splash = ({ header }) => {
      return (
        <View>
          <Text>{header}</Text>
          <Image
            __uuid__="target"
            resizeMode="cover"
            source={{uri: "https://"}}
          />
        </View>
      );
    };
  `;
  const ast = parse(code, { plugins: ["jsx"] });

  test("parent is View", function () {
    let reference;

    traverse(ast, {
      JSXElement(path) {
        if (path.node.openingElement.name.name === "Image") {
          reference = path;
          path.stop();
        }
      },
    });

    const { node, scope, parentPath } = reference;
    expect(parentPath.node.type).toBe("JSXElement");
    expect(parentPath.node.openingElement.name.name).toBe("View");
    expect(parentPath.parentPath.node.type).toBe("ReturnStatement");
  });

  test("parent is View even after a visit", function () {
    let reference;

    traverse(ast, {
      JSXElement(path) {
        if (path.node.openingElement.name.name === "Image") {
          reference = path;
          path.stop();
        }
      },
    });

    const { node, scope, parentPath } = reference;

    expect(parentPath.node.type).toBe("JSXElement");
    expect(reference.parentPath.node.type).toBe("JSXElement");
    expect(parentPath.node.openingElement.name.name).toBe("View");

    const visitParentPath = (ref) => {
      const { node, scope, parentPath } = ref.parentPath;

      const visitor = {
        JSXOpeningElement(path) {
          console.log("Visiting the", path.node.name.name, "element");
        },
      };

      traverse(node, visitor, scope, {}, parentPath);
    };

    // Traversing with the visitor outputs the following (as expected):
    // #=> Visiting the View element
    // #=> Visiting the Text element
    // #=> Visiting the Image element
    visitParentPath(reference);

    expect(parentPath.node.type).toBe("JSXElement");
    // This assertion fails, and instead it's type is `ReturnStatement`
    // For some reason the reference's parent became it's parent.parent
    expect(reference.parentPath.node.type).toBe("JSXElement");
    expect(parentPath.node.openingElement.name.name).toBe("View");
  });
});
