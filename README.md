# npm-package-template
A template appropriate for publishing an npm-template, with step-by-step instructions

## Step-by-step set-up instructions


### Basic webpack setup
Firstly, follow the [webpack basic setup guide](https://webpack.js.org/guides/getting-started/).

Initialize npm with default options, install webpack locally, and install as development dependencies the webpack-cli (the tool used to run webpack on the command line):

```bash
npm init -y
npm install webpack webpack-cli --save-dev
```
### Some files and directories
Create src and dist folders, and add an index.js file in the src directory.

Add a **webpack.config.js** file in the main directory.

```
npm-package-template
  |- package.json
  |- package-lock.json
  |- README.md
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
```

### Webpack configuration

Add some basic webpack configuration details. Note this includes the option to maintain a clean distribution folder.
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
```

### NPM script

Add a script to run the build with webpack
```js
{
  "name": "npm-package-template",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    build": "webpack"
  },
  "keywords": [],
  "author": "Glen Pearson",
  "license": "ISC",
  "dependencies": {
    "webpack": "^5.90.3",
    "webpack-cli": "^5.1.4"
  }
}
```

### Asset management


### Loading CSS
In order to import a CSS file from within a JavaScript module, install the style-loader and css-loader
```bash
npm install --save-dev style-loader css-loader
```
And add them to the module configuration (the sequence is important):
```js
 const path = require('path');

 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'main.js',
     path: path.resolve(__dirname, 'dist'),
   },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
 };
```

Add a **styles.css** file to the src directory and import it in **index.js**
```
  |- /src
    |- index.js
    |- styles.css
```

**index.js**
```js
import './style.css';
```


### Loading Images
To use images we use the built-in webpack Asset Modules, incorporating them into the module configuration:
```js
 const path = require('path');

 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'main.js',
     path: path.resolve(__dirname, 'dist'),
   },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
 };
```

As an example, add **menu-down.svg** to the src directory and import it in **index.js** (note, the image needs to be used for webpack to add it to the build)
```
  |- /src
    |- index.js
    |- styles.css
    |- menu-down.svg
```

**index.js**
```js
import DownCaret from "./menu-down.svg";
```


### Loading Fonts
Similarly, fonts use the built-in webpack Asset Modules, incorporating them into the module configuration.
```js
 const path = require('path');

 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'main.js',
     path: path.resolve(__dirname, 'dist'),
   },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
 };
```

As an example, add **dancing.ttf** to the src directory and incorporate it via an @font-face declaration in **styles.css** (note, the image needs to be used for webpack to add it to the build)
```
  |- /src
    |- index.js
    |- styles.css
    |- menu-down.svg
    |- dancing.ttf
```

**styles.css**
```css
@font-face {
  font-family: 'Dancing';
  src: url('./dancing.ttf');
}

#fontCheck {
  font-family: 'Dancing';
}
```

### .gitignore

Add a gitignore file to ginore the following elements (TO BE ADDED TO). Note, this probably needs to be split into dev and production.
```
node_modules
```

### Configure a development environment

Mode: set to development.

Source maps: Add the "inline-source-map" option to allow errors to be tracked to the original source code.

**webpack.config.js** additions
```js
mode: 'development',
devtool: 'inline-source-map',
```

**webpack-dev-server** provides a rudimentary web server and the ability to use live loading during development. (Note the optimization addition should there be multiple entry points).

```bash
npm install webpack-dev-server --save-dev
```

**webpack.config.js**
```js
const path = require('path');


module.exports = {
  mode: 'development',
  entry: './src/index.js', // webpack builds based on dependencies from this file
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  // optimization: { // avoids issues should there be multiple entry points, only use then
  //   runtimeChunk: 'single',
  //  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // cleans up the dist directory on each build
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
```

Add a script to run the webpack dev server

**package.json** addition 
```json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack serve --open",
    "build": "webpack"
  },
```

### Separating out development and production configuration

We start by installing webpack-merge and then split the existing parts of the config.

merge() calls in the environment-specific configurations to include our common configuration in webpack.dev.js and webpack.prod.js.

```bash
npm install --save-dev webpack-merge
```
(NOT 100% SURE THAT RULES SHOULD BE IN COMMON?)

**webpack.common.js**
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
};

```

**webpack.dev.js**
```js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
});
```

We will also add a more efficient source-map for production

**webpack.prod.js**
```js
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
});
```

Now update the NPM scripts to use the new config files

**package.json**
```json
{
  "name": "npm-package-template",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack serve --open --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  },
  "keywords": [],
  "author": "Glen Pearson",
  "license": "ISC",
  "dependencies": {
    "webpack": "^5.90.3",
    "webpack-cli": "^5.1.4"
  },
  "devDependencies": {
    "css-loader": "^6.10.0",
    "style-loader": "^3.3.4",
    "webpack-dev-server": "^5.0.2",
    "webpack-merge": "^5.10.0"
  }
}
```