function renderSJDON(element, parent) {
    const tagName = element[0];
    const domElement = document.createElement(tagName);
    
    for (let i = 1; i < element.length; i++) {
        const current = element[i];
        
        if (typeof current === 'object' && !Array.isArray(current)) {
            Object.entries(current).forEach(([key, value]) => {
                domElement.setAttribute(key, value);
            });
        }
        else if (Array.isArray(current)) {
            renderSJDON(current, domElement);
        }
        else if (typeof current === 'string') {
            domElement.appendChild(document.createTextNode(current));
        }
    }
    
    parent.appendChild(domElement);
}