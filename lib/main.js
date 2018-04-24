const DomNodeCollection = require("./dom_node_collection");
const weather = require("./weather.js");

var callbacks = [];
var domLoaded = false;

window.$w = arg => {
  switch(typeof(arg)){
    case "string":
       return selectNodes(arg);
    case "function":
      return handleFunction(arg);
    case "object":
      if(arg instanceof HTMLElement){
        return new DomNodeCollection([arg]);
      }
  }
};

$w.extend = (...objects) => {
  return Object.assign({}, ...objects);
};

$w.ajax = inputObject => {
  const newRequest = new XMLHttpRequest();
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    success: () => {},
    error: () => {},
    data: {},
  };
  inputObject = $w.extend(defaults, inputObject);
  inputObject.method = inputObject.method.toUpperCase();
  if (inputObject.method === "GET" && isntEmpty(inputObject.data)){
    inputObject.url += "?" + buildQueryString(inputObject.data);
  }

  newRequest.open(inputObject.method, inputObject.url, true);
  newRequest.onload = () => {
    if (newRequest.status === 200) {
      inputObject.success(newRequest.response);
    } else {
      inputObject.error(newRequest.response);
    }
  };

  newRequest.send();
};

buildQueryString = obj => {
  let result = "";
  let objKeys = Object.keys(obj);
  objKeys.forEach(key => {
    result += key + "=" + obj[key] + "&";
  });
    result = result.split("");
    result.pop();
    return result.join("");
  };

isntEmpty = obj => {
  return Object.keys(obj).length !== 0;
}

handleFunction = callback => {
  if (domLoaded === true){
    callback();
  } else {
    callbacks.push(callback);
  }
};

selectNodes = selector => {
  let nodes = document.querySelectorAll(selector);
  let arrayOfNodes = Array.from(nodes);

  return new DomNodeCollection(arrayOfNodes);
};

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    domLoaded = true;
    callbacks.forEach(callback => callback());
  }
}
