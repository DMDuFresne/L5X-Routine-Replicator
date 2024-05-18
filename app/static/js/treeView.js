// Function to generate a tree view from a JSON object
// Optionally collapses all nodes initially
export function generateTreeView(data, collapsed = true) {
    const ul = document.createElement('ul');

    for (let key in data) {
        const li = document.createElement('li');

        if (typeof data[key] === 'object' && data[key] !== null) {
            // Create a span element to represent the parent key
            const span = document.createElement('span');
            span.textContent = key;
            span.classList.add('parent-text');
            li.appendChild(span);

            // Create a caret element for expanding/collapsing
            const caret = document.createElement('span');
            caret.classList.add('caret');
            span.insertBefore(caret, span.firstChild);

            // Recursively generate tree view for child objects
            const childTreeView = generateTreeView(data[key], collapsed);
            li.appendChild(childTreeView);

            if (collapsed) {
                li.classList.add('collapsed');
                childTreeView.classList.add('hidden');
            }

            // Toggle collapse/expand on parent key click
            span.addEventListener('click', function (event) {
                event.stopPropagation();
                li.classList.toggle('collapsed');
                childTreeView.classList.toggle('hidden');
            });
        } else {
            // Create a div element to represent key-value pairs
            const div = document.createElement('div');
            div.className = 'key-value';

            const keySpan = document.createElement('span');
            keySpan.textContent = key + ':';

            const valueSpan = document.createElement('span');
            valueSpan.textContent = data[key];

            div.appendChild(keySpan);
            div.appendChild(valueSpan);

            li.appendChild(div);
            li.classList.add('no-children');
        }

        ul.appendChild(li);
    }

    return ul;
}

// Function to expand all nodes in the tree view
export function expandAll() {
    const allNodes = document.querySelectorAll('#json-display .collapsed');
    allNodes.forEach(node => {
        node.classList.remove('collapsed');
        node.querySelector('ul').classList.remove('hidden');
    });
}

// Function to collapse all nodes in the tree view
export function collapseAll() {
    const allNodes = document.querySelectorAll('#json-display li:not(.no-children)');
    allNodes.forEach(node => {
        node.classList.add('collapsed');
        node.querySelector('ul').classList.add('hidden');
    });
}
