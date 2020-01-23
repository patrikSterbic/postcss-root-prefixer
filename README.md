# postcss-root-prefixer

[PostCSS] plugin works with css\sass\scss composite selectors and helps to add some prefix to the start of the all selectors in choosed files.

[postcss]: https://github.com/postcss/postcss

Input scss:

```scss
.foo {
  font-size: 10px;
  .bar {
    color: red;
    .baz.buz {
      border: 0;

      &__green {
        border-color: green;
      }
    }
  }
}
```

With using '#root' prefix

Output css:

```scss
#root .foo {
  font-size: 10px;
}

#root .foo .bar {
  color: red;
}

#root .foo .bar .baz.buz {
  border: 0;
}

#root .foo .bar .baz.buz__green {
  border-color: green;
}
```

## Usage

Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you already use PostCSS, add the plugin to plugins list:

```js
module.exports = {
  plugins: [
    +require("postcss-root-prefixer")({ prefix: "some-prefix", fileNamePattern?: /\.modules\.scss$/ }),
    require("autoprefixer")
  ]
};
```

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

[official docs]: https://github.com/postcss/postcss#usage

## Usage with webpack

```js
const prefixer = require("postcss-root-prefixer");

module: {
  rules: [
    {
      test: /\.scss$/,
      use: [
        require.resolve("style-loader"),
        require.resolve("css-loader"),
        require.resolve("sass-loader"),
        {
          loader: require.resolve("postcss-loader"),
          options: {
            ident: "postcss",
            plugins: () => [
              prefixer({ prefix: ".my-prefix" }),
              autoprefixer({
                browsers: ["last 4 versions"]
              })
            ]
          }
        }
      ]
    }
  ];
}
```

## Options

- `prefix` - Required String property. It was adding to every compiled selector
- `fileNamePattern` - Optional RegExp property. You can include only some files. For example, I need to change selectors only in css-modules files like a `bla-bla-bla.modules.scss`. Then I want to pass next RegExp => /\.modules\.scss\$/

## Motivation

This loader will realy useful when you use one of popular css-framework in you're project like a [semantic-ui](https://github.com/Semantic-Org/Semantic-UI), [bootstrap](https://github.com/twbs/bootstrap), [ant-design](https://github.com/ant-design/ant-design), etc. It helps you add root css-class or root id for increasing weight of all your selectors.

In my case I have css-modules and semantic-ui framework. This framework uses long combinations of the selectors, who have realy great weights.

I slove that problem with next trick:

```js
const prefixer = require("postcss-root-prefixer");

module: {
  rules: [
    {
      test: /\.scss$/,
      use: [
        require.resolve("style-loader"),
        require.resolve("css-loader"),
        require.resolve("sass-loader"),
        {
          loader: require.resolve("postcss-loader"),
          options: {
            ident: "postcss",
            plugins: () => [
              prefixer({ prefix: ":global(#root)" }),
              autoprefixer({
                browsers: ["last 4 versions"]
              })
            ]
          }
        }
      ]
    }
  ];
}
```

Css-modules is transforming selectors with addition some hash inside. But if you are using `:global(#root)` function with id-prefix `#root`, your selectors have greater weight than framework and you have good tool.

## Contribute

I'm very glad to meet new contributors! For any questions or bugs, please open an issue. Or, open a pull request with a fix.

## License

MIT © 2020 Sergei Kundryukov.
