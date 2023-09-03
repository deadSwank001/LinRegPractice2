```javascript
// Performing Linear Regression on Advertising dataset

// Importing libraries
const pandas = require('pandas-js');
const {plot, show} = require('nodeplotlib');
const regression = require('regression');
const {min, max, floor, ceil} = Math;
const {sqrt} = require('mathjs');

// Reading data into a DataFrame
let data = pandas.read_csv('Advertising.csv');

// Renaming columns
data.rename({0: 'TV', 1: 'Radio', 2: 'Newspaper', 3: 'Sales'}, {axis: 1, inplace: true});

// Visualizing the relationship between the features and the response using scatterplots
let layout = {title: 'TV vs Sales', xlabel: 'TV', ylabel: 'Sales'}
plot([{x: data['TV'], y: data['Sales'], mode: 'markers'}], layout);
show();

layout = {title: 'Radio vs Sales', xlabel: 'Radio', ylabel: 'Sales'}
plot([{x: data['Radio'], y: data['Sales'], mode: 'markers'}], layout);
show();

layout = {title: 'Newspaper vs Sales', xlabel: 'Newspaper', ylabel: 'Sales'}
plot([{x: data['Newspaper'], y: data['Sales'], mode: 'markers'}], layout);
show();

// Creating X and y
let X = data.loc[:, ['TV']];
let y = data.loc[:, 'Sales'];

// Fitting the Linear Regression model
let result = regression.linear(X.values, y.values);
console.log(result.equation);

// Plotting the Linear Regression line
let xMin = min(X.values);
let xMax = max(X.values);
let yMin = result.predict(xMin)[1];
let yMax = result.predict(xMax)[1];
let trace1 = {x: [xMin[0], xMax[0]], y: [yMin, yMax], type: 'scatter', name: 'Regression Line'};
let trace2 = {x: X.values.flat(), y: y.values, mode: 'markers', name: 'Data Points'};
layout = {title: 'Linear Regression on TV and Sales', xlabel: 'TV', ylabel: 'Sales'};
plot([trace1, trace2], layout);
show();

// Calculating R-squared
let yPred = result.predict(X.values);
let SSRes = y.values.reduce((acc, cur, idx) => acc + (cur - yPred[idx][1]) ** 2, 0);
let SSTotal = y.values.reduce((acc, cur) => acc + (cur - mean(y.values)) ** 2, 0);
let rSquared = 1 - (SSRes / SSTotal);
console.log(rSquared);

function mean(arr) {
    return arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
}
```

Note: The `regression` library is used for performing the linear regression calculation. You can install it using the following command in your terminal:
```
npm install regression