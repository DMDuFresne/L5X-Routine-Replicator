import { updateTableButtonStatus } from './domUtils.js';
import { clearTable } from './table.js';

export function showContextMenu(x, y, type, element) {
    const contextMenu = document.getElementById("contextMenu");
    const headerRow = document.getElementById("header-row");
    const tableBody = document.getElementById("replacement-table").getElementsByTagName('tbody')[0];

    // Set the position and display the context menu
    contextMenu.style.left = x + "px";
    contextMenu.style.top = y + "px";
    contextMenu.style.display = "block";
    contextMenu.innerHTML = "";

    if (type === "header") {
        // Create and append the rename option to the context menu
        const renameOption = document.createElement("div");
        renameOption.textContent = "Rename";
        renameOption.addEventListener("click", function() {
            const newName = prompt("Enter the new name for the column:");
            if (newName) {
                element.textContent = newName;
            }
            contextMenu.style.display = "none";
        });
        contextMenu.appendChild(renameOption);

        // Create and append the delete option to the context menu
        const deleteOption = document.createElement("div");
        deleteOption.textContent = "Delete";
        deleteOption.addEventListener("click", function() {
            const index = Array.from(headerRow.cells).indexOf(element);
            headerRow.removeChild(element);
            for (let row of tableBody.rows) {
                row.deleteCell(index);
            }
            if (headerRow.cells.length === 0) {
                clearTable();
            }
            updateTableButtonStatus();
            contextMenu.style.display = "none";
        });
        contextMenu.appendChild(deleteOption);
    } else if (type === "row") {
        // Create and append the delete row option to the context menu
        const deleteOption = document.createElement("div");
        deleteOption.textContent = "Delete Row";
        deleteOption.addEventListener("click", function() {
            element.remove();
            contextMenu.style.display = "none";
        });
        contextMenu.appendChild(deleteOption);
    }

    // Hide context menu on clicking outside
    document.addEventListener("click", function(e) {
        if (e.target !== contextMenu) {
            contextMenu.style.display = "none";
        }
    });
}
