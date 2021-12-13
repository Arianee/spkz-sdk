# State Management

## How to add a brand new reducer:

1. Create folder in ```reducers``` directory
2. Create 2 files in your reducer directory ```actions``` and ```reducer```
3. Add your reducer in the ```combineReducers``` in the ```store``` directory

## Actions

Action type must be unique. So scope it.
An ``action`` is a function that will dispatch to store.

## Reducer

A reducer is the state manager, the bdd. There should not be any business logic in it.
There maybe logic to avoid duplicate entries... Business logic, api calls, mappers should be in ``action``.

## Retrieving state from store

store.subscribe()
