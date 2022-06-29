# Babel JSX parentPath behavior!

This repository holds reproduction steps for an apparent issue with selecting a
`JSXElement`'s `parentPath` in succession.

When traversing with a visitor the second call to `.parentPath` returns it's
parent's parent instead of just its parent.

## Getting started

Install dependencies and run jest:

```shell
npm install
jest
```

You can use [ASTExplorer](https://astexplorer.net/#/gist/04f9f9f981f77c88e2685defef6e3b76/latest) to double check the AST.

You should see an output similar to the Preview image included:
![jest preview image](/jest-preview.png)
