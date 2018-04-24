class DomNodeCollection {

  constructor(elements) {
    this.elements = elements;
  };

  value(val) {
    if (val === undefined) {
      return this.elements[0].value;
    } else {
      this.elements.forEach(el => {
        el.value = val;
      });
    }
  };

  html(content) {
    if (typeof(content) === "string") {
      this.elements.forEach(el => {
        el.innerHTML = content;
      });
    } else if (this.elements.length > 0) {
      return this.elements[0].innerHTML;
    };

    return null;
  };

  empty() {
    this.html("");
  };

  append(arg) {
      if (typeof arg === 'object' &&
          !(arg instanceof DomNodeCollection)) {
        arg = $w(arg);
      };

      if (typeof arg === "string") {
        this.elements.forEach(el => el.innerHTML += arg);
      } else if (arg instanceof DomNodeCollection) {
        this.elements.forEach(el => {
          arg.forEach(childNode => {
            el.appendChild(childNode.cloneNode(true));
          });
        });
      };
    };

    addClass(klass) {
      this.elements.forEach(el => {
        const currentClasses = el.className;
        const newClasses = currentClasses + " " + klass;
        el.className = newClasses;
      });
    };

    removeClass(klass) {
      this.elements.forEach(el => {
        el.classList.remove(klass);
      });
    };

    attr(attrName, value = null) {
      if (value === null) {
        return this.elements[0].getAttribute(attrName);
      } else {
        this.elements.forEach(el => {
          el.setAttribute(attrName, value);
        });

        return this.elements;
      };
    };


    children() {
      let children = [];
      this.elements.forEach (el => {
        for (let i = 0; i < el.children.length; i++) {
        children.push(el.children[i]);
        };
      });

      return new DomNodeCollection(children);
    };

    parent() {
      let parents = [];
      this.elements.forEach(el => {
        for (let i = 0; i < el.parents.length; i++) {
          parents.push(el.parents[i]);
        };
      });

      return new DomNodeCollection(parents);
    };

    find(selector) {
      const nodes = [];
      this.elements.forEach(el => {
        nextEl = el.querySelectorAll(selector);
        nodes = nodes.concat(Array.from(nextEl));
      });

      return new DomNodeCollection(nodes);
    };

    remove() {
      this.elements.forEach(el => el.parentNode.removeChild(el));
    };

    on(eventName, callback) {
     this.elements.forEach(obj => {
       obj.addEventListener(eventName, callback);
       const eventKey = `wiseDOMEvents-${eventName}`;
       if (typeof obj[eventKey] === "undefined") {
         obj[eventKey] = [];
       }
       obj[eventKey].push(callback);
     });
   };

   off(eventName) {
     this.elements.forEach(obj => {
       const eventKey = `wiseDOMEvents-${eventName}`;
       if (obj[eventKey]) {
         obj[eventKey].forEach(callback => {
           obj.removeEventListener(eventName, callback);
         });
       };
       obj[eventKey] = [];
     });
   };

};

module.exports = DomNodeCollection;
