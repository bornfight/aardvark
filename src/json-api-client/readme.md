# Json-api-client

A json:api bundle (currently bound to this project) that enables easier json:api
consumption.

## Defining models

It's **very important** to add `@attribute` decorator for all the attributes a
json:api class has and `@relationship` decorator for all the relationships.

`@relationship` will automatically push the relationship's key name to the
relationshipNames attribute, so you don't have to manually create it.

Also, static property type must be set. It serves for serialization.

#### Things to watch out

-   all relationships must be optional! This is because their are foreign keys
    and most of the time we fetch them from the backend. We can not know for
    sure that they exist as we can with attributes
-   all relationships must have ToManyRelationship or ToOneRelationships type.
    This is to allow correct nullable types and for deleting of relationships

## Usage

```
type FooJSONAModel = JSONAModel<{
    name: string;
    bar: string;
}, {
    stuff?: StuffJSONAModel[];
}>;

class FooModel extends BaseJsonApiModel<FooJSONAModel> {
    public static type = "fooType";

    @attribute bar: string;
    @relationship stuff: ToManyRelationship<StuffJSONAModel>;
    @relationship thing: ToOneRelationship<ThingJSONAModel>;
}

```

### Common errors 🦟

```
defaults.js:52 Uncaught (in promise) TypeError: Converting circular structure to JSON
    --> starting at object with constructor 'Object'
    |     property 'category' -> object with constructor 'Object'
    |     property 'categoryTypes' -> object with constructor 'Array'
    --- index 0 closes the circle
    at JSON.stringify (<anonymous>)
    at transformRequest (defaults.js:52)
    at transform (transformData.js:17)
    at Object.forEach (utils.js:236)
    at transformData (transformData.js:16)
    at dispatchRequest (dispatchRequest.js:42)
```

This usually means relationshipName on some model is not configured properly and
the serializer treats the property as an attribute, not as a relationship. Make
sure relationship decorator is set.
