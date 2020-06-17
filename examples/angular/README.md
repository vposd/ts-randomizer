# Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.1.

Here is an example Angular project with configured `ts-randomizer`.

Run tests
```
npm test
```

## How to setup ts-randomizer from scratch

We need to provide a typescript transformer from ts-randomizer during the test process.

There is a special `ngx-build-plus:browser` builder for Angular (it replaces standard builder for ng build command) from [ngx-build-plus](https://github.com/manfredsteyer/ngx-build-plus) (by [Manfred Steyer](https://medium.com/@ManfredSteyer)).

Install `ngx-build-plus`. It extends the Angular CLI's default build behavior without ejecting and allows to modify internal webpack configuration in Angular projects.

```
ng add ngx-build-plus
```

Then we need install `ts-randomizer`

```
npm i ts-randomizer
```

Now we need to write a webpack-modifier plugin that gets access to AngularCompilerPlugin instance and will modify its _transformers prop by adding ts-randomizer transformer to the list.

[ng-plugin.ts](https://github.com/vposd/ts-randomizer/blob/master/examples/angular/ng-plugin.ts)

During the test process, webpack applies AngularCompilerPlugin transformers.

To run the whole thing we first have to execute the following command in project root to compile the `ng-plugin.ts`

```
tsc --skipLibCheck --module umd
``` 

Then we can run test command to execute the test pipeline from Angular with added ts-randomizer.

```
ng test --plugin ~dist/out-tsc/ng-plugin.js
```

## Sources to read
 - [Having fun with Angular and Typescript Transformers](https://medium.com/angular-in-depth/having-fun-with-angular-and-typescript-transformers-2c2296845c56)
 - [Angular CLI flows. Big picture.](https://medium.com/angular-in-depth/angular-cli-flows-big-picture-9ed1a0d1930)
