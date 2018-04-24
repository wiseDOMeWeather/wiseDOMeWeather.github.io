# wiseDOMe

### Inspired by jQuery

WiseDOMe is a lightweight JavaScript library for manipulating and traversing the DOM. It is set up to help make it easier for developers to perform actions on HTML Elements and set or change values of HTML DOM Element properties. You can pass in a string value, an HTML Element or a function into wiseDOMe's $W function.

## Ajax Requests

* .ajax()
  - Creates and sends an asynchronous XMLHttpRequest by handling the open, onload and send functions. Takes success and error callbacks to be pushed onto the task queue after the async request has return a response from the sever.

## DOM Manipulation

* .html()
  - Set the HTML for every element or get the html for the first element.

* .append()
  - Insert the specified content to the end of each element.

* .attr()
  - Get the attributes value for the first element or set the attributes for every matched element.

* .removeClass()
  - Remove specified class from the elements classList.

* .addClass()
  - Add a specified class to the elements classList.

## DOM Traversal

* .children()
  - Get the children for each element in the specified set of elements.

* .parent()
  - Get the parents for each element in the specified set of elements.

* .find()
  - Get the descendants of each element in the set based on a class name selector.
