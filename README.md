# Aardvark
**Data consumption React hooks for JSON:API specification**

[![codecov](https://codecov.io/gh/bornfight/aardvark/branch/master/graph/badge.svg)](https://codecov.io/gh/bornfight/aardvark)

TypeScript friendly

Install with the following command:

```
yarn add @bornfight/aardvark
or
npm install @bornfight/aardvark
```

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

## Other hooks
### usePost
Constructs a function used for POST requests. Returns create function, loading, record and operation name.

hook parameters:
 - actionHandler

create function parameters (pick one):
 - model object and includeNames: 
     - model is connected to actionHandler's entity
     - includeNames determine the recognition of model's relationships. It is used with dot notation for nested relationships. E.g. includeNames=["car.owner.document"]
     
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

## ActionHandler
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
