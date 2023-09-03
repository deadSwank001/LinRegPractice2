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


// npm install regression


// Multiple Linear Regression
// Creating X and y
X = data.loc[:, ['TV', 'Radio', 'Newspaper']];
y = data.loc[:, 'Sales'];

// Fitting the Linear Regression model
result = regression.linear(X.values, y.values);
console.log(result.equation);

// Rounding the coefficients to two decimal places
let coeffs = result.equation.slice(0, -1).map((val) => floor(val * 100) / 100);
let intercept = floor(result.equation.slice(-1)[0] * 100) / 100;
console.log(`Coefficients: ${coeffs}`);
console.log(`Intercept: ${intercept}`);

// Calculating R-squared
yPred = result.predict(X.values);
SSRes = y.values.reduce((acc, cur, idx) => acc + (cur - yPred[idx][1]) ** 2, 0);
SSTotal = y.values.reduce((acc, cur) => acc + (cur - mean(y.values)) ** 2, 0);
rSquared = 1 - (SSRes / SSTotal);
console.log(rSquared);

// Creating a heatmap to visualize the correlation between the features
let corrMatrix = data.corr();
let z = corrMatrix.values;
let x = corrMatrix.columns;
let y1 = corrMatrix.index;
const heatmap = {
    z: z,
    x: x,
    y: y1,
    type: 'heatmap',
    colorscale: 
    [['0.0', 'rgb(255,245,240)'], ['0.2', 'rgb(254,224,210)'],
    ['0.4', 'rgb(252,187,161)'], ['0.6', 'rgb(252,146,114)'],
    ['0.8', 'rgb(251,106,74)'], ['1.0', 'rgb(203,24,29)']],
};
layout = {title: 'Correlation Matrix'};
plot([heatmap], layout);
show();

// Dropping the Newspaper column
data.drop('Newspaper', {axis: 1, inplace: true});

// Creating X and y
X = data.loc[:, ['TV', 'Radio']];
y = data.loc[:, 'Sales'];

// Fitting the Linear Regression model
result = regression.linear(X.values, y.values);
console.log(result.equation);

// Rounding the coefficients to two decimal places
coeffs = result.equation.slice(0, -1).map((val) => floor(val * 100) / 100);
intercept = floor(result.equation.slice(-1)[0] * 100) / 100;
console.log(`Coefficients: ${coeffs}`);
console.log(`Intercept: ${intercept}`);

// Calculating R-squared
yPred = result.predict(X.values);
SSRes = y.values.reduce((acc, cur, idx) => acc + (cur - yPred[idx][1]) ** 2, 0);
SSTotal = y.values.reduce((acc, cur) => acc + (cur - mean(y.values)) ** 2, 0);
rSquared = 1 - (SSRes / SSTotal);
console.log(rSquared);
```

In the code, we first import the necessary libraries, like `pandas-js` for handling the dataset, `nodeplotlib` for creating different plots, and `regression` for performing linear regression. 

We then read the `Advertising.csv` file and rename the columns. After that, we create scatter plots to visualize the relationship between the features and the response using the `plot` function. 

Next, we perform simple linear regression on the `TV` and `Sales` columns and plot the linear regression line. We then calculate the R-squared value to evaluate the fit of the model. 

Moving on, we perform multiple linear regression on the `TV`, `Radio`, and `Newspaper` columns and round the coefficients and intercept to two decimal places. We also calculate the R-squared value for this model and create a heatmap to visualize the correlation between the features.

Finally, we drop the `Newspaper` column as it was found to have no significant association with the response variable and redo the multiple linear regression with only the `TV` and `Radio` columns. We round the coefficients and intercept to two decimal places and calculate the R-squared value for this model.
```
// Polynomial Regression
// Creating X and y
X = data.loc[:, ['TV']];
y = data.loc[:, 'Sales'];

// Fitting the Polynomial Regression model of degree 2
let X2 = X.apply((val) => [val, val ** 2]);
result = regression.polynomial(X2.values, y.values, 2);
console.log(result.equation);

// Creating a linspace for plotting the curve
let linspace = pandas.DataFrame({0: Array.from({length: 50}, (_, i) => (i / 49) * (max(X.values) - min(X.values)) + min(X.values)).flat()});
let yPred2 = linspace[0].apply((val) => result.predict([val, val ** 2]).y);
let curve = {x: linspace.values.flat(), y: yPred2.flat(), type: 'scatter', name: 'Polynomial Regression Curve'};
let trace = {x: X2.apply((row) => row[0]), y: y, mode: 'markers', name: 'Data Points'};
layout = {title: 'Polynomial Regression (Degree 2) on TV and Sales', xaxis: {title: 'TV'}, yaxis: {title: 'Sales'}};
plot([trace, curve], layout);
show();

// Calculating R-squared
yPred = result.predict(X2.values);
SSRes = y.values.reduce((acc, cur, idx) => acc + (cur - yPred[idx]) ** 2, 0);
SSTotal = y.values.reduce((acc, cur) => acc + (cur - mean(y.values)) ** 2, 0);
rSquared = 1 - (SSRes / SSTotal);
console.log(rSquared);

// Fitting the Polynomial Regression model of degree 3
let X3 = X.apply((val) => [val, val ** 2, val ** 3]);
result = regression.polynomial(X3.values, y.values, 3);
console.log(result.equation);

// Creating a linspace for plotting the curve
linspace = pandas.DataFrame({0: Array.from({length: 50}, (_, i) => (i / 49) * (max(X.values) - min(X.values)) + min(X.values)).flat()});
yPred2 = linspace[0].apply((val) => result.predict([val, val ** 2, val ** 3]).y);
curve = {x: linspace.values.flat(), y: yPred2.flat(), type: 'scatter', name: 'Polynomial Regression Curve'};
trace = {x: X3.apply((row) => row[0]), y: y, mode: 'markers', name: 'Data Points'};
layout = {title: 'Polynomial Regression (Degree 3) on TV and Sales', xaxis: {title: 'TV'}, yaxis: {title: 'Sales'}};
plot([trace, curve], layout);
show();

// Calculating R-squared
yPred = result.predict(X3.values);
SSRes = y.values.reduce((acc, cur, idx) => acc + (cur - yPred[idx]) ** 2, 0);
SSTotal = y.values.reduce((acc, cur) => acc + (cur - mean(y.values)) ** 2, 0);
rSquared = 1 - (SSRes / SSTotal);
console.log(rSquared);
```

In the code, we perform polynomial regression on the `TV` and `Sales` columns using two different degrees, 2 and 3. 

We first create X and y and fit the polynomial regression model using `regression.polynomial`. We then create a `linspace` for plotting the curve and calculate the R-squared value for each model. 

Lastly, we create scatter plots for each model and plot the polynomial regression curve using the `plot` function along with the data points. We also set the appropriate titles for the axes and the plot.
```
// Ridge Regression
// Creating X and y
X = data.loc[:, ['TV', 'Radio', 'Newspaper']];
y = data.loc[:, 'Sales'];

// Fitting the Ridge Regression model
let n = X.shape[1];
result = regression.ridge(X.values, y.values, 0.5, [n]);
console.log(result.equation);

// Rounding the coefficients to two decimal places
coeffs = result.equation.slice(0, -1).map((val) => floor(val * 100) / 100);
intercept = floor(result.equation.slice(-1)[0] * 100) / 100;
console.log(`Coefficients: ${coeffs}`);
console.log(`Intercept: ${intercept}`);

// Calculating R-squared
yPred = result.predict(X.values);
SSRes = y.values.reduce((acc, cur, idx) => acc + (cur - yPred[idx][1]) ** 2, 0);
SSTotal = y.values.reduce((acc, cur) => acc + (cur - mean(y.values)) ** 2, 0);
rSquared = 1 - (SSRes / SSTotal);
console.log(rSquared);
```

In the code, we perform Ridge Regression on the `TV`, `Radio`, and `Newspaper` columns. We first create X and y and fit the Ridge Regression model using `regression.ridge`. We also set the regularization parameter `alpha` to 0.5 and the regularization type as L2. 

We then round the coefficients and intercept to two decimal places and calculate the R-squared value for this model. 

Lastly, we output the coefficients, intercept, and R-squared value to the console for analysis.
```
// Lasso Regression
// Creating X and y
X = data.loc[:, ['TV', 'Radio', 'Newspaper']];
y = data.loc[:, 'Sales'];

// Fitting the Lasso Regression model
result = regression.lasso(X.values, y.values);
console.log(result.equation);

// Rounding the coefficients to two decimal places
coeffs = result.equation.slice(0, -1).map((val) => floor(val * 100) / 100);
intercept = floor(result.equation.slice(-1)[0] * 100) / 100;
console.log(`Coefficients: ${coeffs}`);
console.log(`Intercept: ${intercept}`);

// Calculating R-squared
yPred = result.predict(X.values);
SSRes = y.values.reduce((acc, cur, idx) => acc + (cur - yPred[idx][1]) ** 2, 0);
SSTotal = y.values.reduce((acc, cur) => acc + (cur - mean(y.values)) ** 2, 0);
rSquared = 1 - (SSRes / SSTotal);
console.log(rSquared);
```

In the code, we perform Lasso Regression on the `TV`, `Radio`, and `Newspaper` columns. We first create X and y and fit the Lasso Regression model using `regression.lasso`. 

We then round the coefficients and intercept to two decimal places and calculate the R-squared value for this model. 

Lastly, we output the coefficients, intercept, and R-squared value to the console for analysis.

```
// Elastic Net Regression
// Creating X and y
X = data.loc[:, ['TV', 'Radio', 'Newspaper']];
y = data.loc[:, 'Sales'];

// Fitting the Elastic Net Regression model
result = regression.elasticNet(X.values, y.values, 0.5, [n]);
console.log(result.equation);

// Rounding the coefficients to two decimal places
coeffs = result.equation.slice(0, -1).map((val) => floor(val * 100) / 100);
intercept = floor(result.equation.slice(-1)[0] * 100) / 100;
console.log(`Coefficients: ${coeffs}`);
console.log(`Intercept: ${intercept}`);

// Calculating R-squared
yPred = result.predict(X.values);
SSRes = y.values.reduce((acc, cur, idx) => acc + (cur - yPred[idx][1]) ** 2, 0);
SSTotal = y.values.reduce((acc, cur) => acc + (cur - mean(y.values)) ** 2, 0);
rSquared = 1 - (SSRes / SSTotal);
console.log(rSquared);
```

In the code, we perform Elastic Net Regression on the `TV`, `Radio`, and `Newspaper` columns. We first create X and y and fit the Elastic Net Regression model using `regression.elasticNet`. We set the regularization parameter `alpha` to 0.5 and the regularization type as L2.

We then round the coefficients and intercept to two decimal places and calculate the R-squared value for this model. 

Lastly, we output the coefficients, intercept, and R-squared value to the console for analysis.
```

// Ridge Regression
// Creating X and y
X = data.loc[:, ['TV', 'Radio', 'Newspaper']];
y = data.loc[:, 'Sales'];

// Fitting the Ridge Regression model
result = regression.ridge(X.values, y.values, [n]);
console.log(result.equation);

// Rounding the coefficients to two decimal places
coeffs = result.equation.slice(0, -1).map((val) => floor(val * 100) / 100);
intercept = floor(result.equation.slice(-1)[0] * 100) / 100;
console.log(`Coefficients: ${coeffs}`);
console.log(`Intercept: ${intercept}`);

// Calculating R-squared
yPred = result.predict(X.values);
SSRes = y.values.reduce((acc, cur, idx) => acc + (cur - yPred[idx][1]) ** 2, 0);
SSTotal = y.values.reduce((acc, cur) => acc + (cur - mean(y.values)) ** 2, 0);
rSquared = 1 - (SSRes / SSTotal);
console.log(rSquared);
```

In the last part of the code, we perform Ridge Regression on the `TV`, `Radio`, and `Newspaper` columns. We first create X and y and fit the Ridge Regression model using `regression.ridge`.

We then round the coefficients and intercept to two decimal places and calculate the R-squared value for this model. 

Lastly, we output the coefficients, intercept, and R-squared value to the console for analysis.

This completes the code for performing Linear Regression, Lasso Regression, Elastic Net Regression, and Ridge Regression. This code can be used as a starting point for building more complex machine learning models using JavaScript.

A brief summary of each regression technique and their differences:

Linear Regression: 

Linear Regression is a basic statistical approach to modeling the relationship between a dependent variable and one or more independent variables. It assumes that there is a linear relationship between the independent and dependent variables, and the aim is to fit a linear equation that best represents this relationship.

Lasso Regression:

Lasso Regression is a method that applies a penalty to the absolute value of the coefficients, which is known as L1 regularization. This technique helps to reduce overfitting in the model by shrinking the less important features' coefficients to zero. Hence, lasso regression performs feature selection and reduces the impact of unnecessary features.

Ridge Regression:

Ridge Regression is a method that applies a penalty to the squared value of the coefficients, also known as L2 regularization. This technique reduces the weights of the less important features but does not necessarily eliminate them, unlike Lasso. Ridge regression also helps to reduce overfitting and improves the generalization performance of the model.

Elastic Net Regression:

Elastic Net Regression combines the features of the Lasso and Ridge regression techniques. It applies both penalties (L1 and L2) to the model, resulting in a hybrid regularization technique that helps to eliminate redundant features while avoiding overfitting. The elastic portion of the method balances L1 and L2 coefficients and finds the optimal model.

Overall, these regression techniques provide useful approaches for modeling relationships between variables and improve the model's accuracy and generalization performance.
```