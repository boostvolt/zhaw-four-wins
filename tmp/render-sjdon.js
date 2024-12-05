function renderSJDON(element, parent) {
  // Extract the tag name (first element)
  const tagName = element[0];

  // Create the DOM element
  const domElement = document.createElement(tagName);

  // Process remaining elements
  for (let i = 1; i < element.length; i++) {
    const current = element[i];

    // If it's an object, apply attributes
    if (typeof current === "object" && !Array.isArray(current)) {
      Object.entries(current).forEach(([key, value]) => {
        domElement.setAttribute(key, value);
      });
    }
    // If it's an array, recursively create child element
    else if (Array.isArray(current)) {
      renderSJDON(current, domElement);
    }
    // If it's a string, create text node
    else if (typeof current === "string") {
      domElement.appendChild(document.createTextNode(current));
    }
  }

  // Append the element to parent
  parent.appendChild(domElement);
}
