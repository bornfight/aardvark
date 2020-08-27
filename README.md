# Aardvark
**Data consumption React hooks for JSON:API specification**
TypeScript friendly

## GET hooks 
### useGet
Immediately fetches data when called. It returns fetched record, loading state and the operation name.

parameters:  
 - actionHandler
 - id
 - includes (optional) 

Usage example
```ts
const { 
  record: car,
  loading: carLoading,
} = useGet(carActionHandler, id, includes);
```

### useGetAll
Immediately fetches data collection of an entity. Returns an array of fetched objects, loading state and the operation name

parameters:
 - actionHandler
 - JsonApiQuery (don't worry, we offer construction of the query too)

Usage example
```ts
const {  
  collection: cars,  
  loading: carsLoading,  
} = useGetAll(carActionHandler, carJsonApiQuery);
```

### useGetControlled
Fetches single entity data on function call. It returns the fetch action, loading, record and the operation name.
Similar to useGet 

parameters:
 - actionHandler
 - id
 - includes (optional) 
 
 Usage example
 ```ts
const {  
  getSingle: getCar,  
  loading: getCarLoading,  
  record: car,
} = useGetControlled(carActionHandler, id, includes);

// call the exposed function
getCar();
```

### useGetAllControlled
Fetches collection data on function call. It returns the fetch action, loading, record and the operation name.
Similar to useGetAll

parameters:
 - actionHandler
 - JsonApiQuery

Usage example
```ts
const {
  getAll: getCars  
  collection: cars,  
  loading: carsLoading,  
} = useGetAllControlled(carActionHandler, carJsonApiQuery);

// call the exposed function
getCars();
```

## POST hooks
### usePost
Constructs a function used for POST requests. Returns create function, loading, record and operation name.

hook parameters:
 - actionHandler

create function parameters (pick one):
 - model object and includeNames 
 or
 - rawData object


Usage example with model param:
```ts
const {  
  create: createCar,  
  loading: createCarLoading,  
} = usePost(carActionHandler);

createCar({
  model: {
	type: "car",
	brand: "coolCarBrand",  
	color: "blue",  
	year: "2020",
	owner: {
	  id: "3"
	}
  },
  includeNames: ["owner"]
```
Usage example with rawData:
```ts
const {  
  create: createCar,  
  loading: createCarLoading,  
} = usePost(carActionHandler);

createCar({
  rawData: {
	data: {
	  attributes: {
	    type: "car",
		brand: "coolCarBrand",  
		color: "green",  
		year: "2020",
	  },
	  relationships: {
	    owner: {
  	      id: "3"
	    }
	  }
	}
  }
```

### usePatch
Constructs a function used for PATCH requests. Returns update function, loading, record and operation name.

hook parameters:
 - actionHandler

update function parameters:
- id
- an object with: model and includeNames

Usage example
```ts
const {  
  update: updateCar,  
  loading: updateCarLoading,  
} = usePatch(carActionHandler);
```
```ts
updateCar(id, {  
  model: {  
  type: "car",  
  id,  
  brand: "hotCarBrand",  
  color: "red",  
  year: "2021",
 },
  includeNames: ["owner"],
}
 ```

### useDelete
Constructs a function used for DELETE requests. Returns delete function, loading, record and operation name.

hook parameters:
 - actionHandler

delete function parameters:
 - id

Usage example

```ts
const {  
  deleteRecord: deleteCar,  
  loading: deleteCarLoading,  
} = useDelete(carActionHandler);

deleteCar("3");
 ```

### ActionHandler
ActionHandler is used to define type of a resource, its endpoint and a selector.
It creates actions for redux repending on the hook
They are easy to write with the provided class.

Create actionHandler example:
```ts
// CarActionHandler.ts file

import { CarSelector } from "./CarSelector";  
import { CarJSONAModel } from "./types/CarJSONAModel";  
import { ApiActionHandler } from "../json-api-client/ApiActionHandler";  
  
class CarActionHandler extends ApiActionHandler<CarJSONAModel> {  
  constructor() {  
  super("car", "/cars", new CarSelector());  
 }}  
  
export const carActionHandler = new CarActionHandler();
```
```ts
// CarJSONAModel.ts file

import { JSONAModel } from "../../interfaces/JSONAModel";  
import { Car } from "../interfaces/Car";  
import { OwnerJSONAModel } from "./OwnerJSONAModel";  
  
export type CarJSONAModel = JSONAModel<Car, Relationships>;  
  
interface Relationships {  
  owner: OwnerJSONAModel;  
}
```
```ts
// CarSelector.ts file

import { CarJSONAModel } from "./types/CarJSONAModel";  
import { BaseApiSelector } from "../selectors/base/BaseApiSelector";  
  
export class CarSelector extends BaseApiSelector<CarJSONAModel> {  
  constructor() {  
  super("car");  
 }}
```


# TSDX React User Guide

Congrats! You just saved yourself hours of work by bootstrapping this project with TSDX. Let’s get you oriented with what’s here and how to use it.

> This TSDX setup is meant for developing React components (not apps!) that can be published to NPM. If you’re looking to build an app, you should use `create-react-app`, `razzle`, `nextjs`, `gatsby`, or `react-static`.

> If you’re new to TypeScript and React, checkout [this handy cheatsheet](https://github.com/sw-yx/react-typescript-cheatsheet/)

## Commands

TSDX scaffolds your new library inside `/src`, and also sets up a [Parcel-based](https://parceljs.org) playground for it inside `/example`.

The recommended workflow is to run TSDX in one terminal:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

Then run the example inside another:

```bash
cd example
npm i # or yarn to install dependencies
npm start # or yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure TSDX is running in watch mode like we recommend above. **No symlinking required**, [we use Parcel's aliasing](https://github.com/palmerhq/tsdx/pull/88/files).

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is [set up for you](https://github.com/palmerhq/tsdx/pull/45/files) with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`. This runs the test watcher (Jest) in an interactive mode. By default, runs tests related to files changed since the last commit.

#### Setup Files

This is the folder structure we set up for you:

```shell
/example
  index.html
  index.tsx       # test your component here in a demo app
  package.json
  tsconfig.json
/src
  index.tsx       # EDIT THIS
/test
  blah.test.tsx   # EDIT THIS
.gitignore
package.json
README.md         # EDIT THIS
tsconfig.json
```

#### React Testing Library

We do not set up `react-testing-library` for you yet, we welcome contributions and documentation on this.

### Rollup

TSDX uses [Rollup v1.x](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### Travis

_to be completed_

### Circle

_to be completed_

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log('foo');
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Using the Playground

```bash
cd example
npm i # or yarn to install dependencies
npm start # or yarn start
```

The default example imports and live reloads whatever is in `/dist`, so if you are seeing an out of date component, make sure TSDX is running in watch mode like we recommend above. **No symlinking required**!

## Deploying the Playground

The Playground is just a simple [Parcel](https://parceljs.org) app, you can deploy it anywhere you would normally deploy that. Here are some guidelines for **manually** deploying with the Netlify CLI (`npm i -g netlify-cli`):

```bash
cd example # if not already in the example folder
npm run build # builds to dist
netlify deploy # deploy the dist folder
```

Alternatively, if you already have a git repo connected, you can set up continuous deployment with Netlify:

```bash
netlify init
# build command: yarn build && cd example && yarn && yarn build
# directory to deploy: example/dist
# pick yes for netlify.toml
```

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).

## Usage with Lerna

When creating a new package with TSDX within a project set up with Lerna, you might encounter a `Cannot resolve dependency` error when trying to run the `example` project. To fix that you will need to make changes to the `package.json` file _inside the `example` directory_.

The problem is that due to the nature of how dependencies are installed in Lerna projects, the aliases in the example project's `package.json` might not point to the right place, as those dependencies might have been installed in the root of your Lerna project.

Change the `alias` to point to where those packages are actually installed. This depends on the directory structure of your Lerna project, so the actual path might be different from the diff below.

```diff
   "alias": {
-    "react": "../node_modules/react",
-    "react-dom": "../node_modules/react-dom"
+    "react": "../../../node_modules/react",
+    "react-dom": "../../../node_modules/react-dom"
   },
```

An alternative to fixing this problem would be to remove aliases altogether and define the dependencies referenced as aliases as dev dependencies instead. [However, that might cause other problems.](https://github.com/palmerhq/tsdx/issues/64)
