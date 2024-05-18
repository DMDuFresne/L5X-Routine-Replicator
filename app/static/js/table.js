import { showContextMenu } from './contextMenu.js';
import { updateTableButtonStatus } from './domUtils.js';
import { showToast } from './toast.js';

// Function to add a new column to the table
export function addColumn() {
    const headerRow = document.getElementById("header-row");
    const tableBody = document.getElementById("replacement-table").getElementsByTagName('tbody')[0];

    const newColumn = prompt("Enter the name for the new column:");
    if (newColumn) {
        // Create and append a new header cell
        const headerCell = document.createElement("th");
        headerCell.textContent = newColumn;
        headerCell.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            showContextMenu(e.pageX, e.pageY, "header", headerCell);
        });
        headerRow.appendChild(headerCell);

        // Add a new cell to each row in the table body
        for (let row of tableBody.rows) {
            let cell = row.insertCell();
            cell.textContent = "";
            let input = document.createElement("input");
            input.type = "text";
            cell.appendChild(input);
        }

        updateTableButtonStatus(); // Update the status of table buttons
    }
}

// Function to add a new row to the table
export function addRow() {
    const headerRow = document.getElementById("header-row");
    const tableBody = document.getElementById("replacement-table").getElementsByTagName('tbody')[0];

    const newRow = tableBody.insertRow();
    newRow.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        showContextMenu(e.pageX, e.pageY, "row", newRow);
    });

    // Add a new cell for each header cell
    for (let i = 0; i < headerRow.cells.length; i++) {
        let cell = newRow.insertCell();
        let input = document.createElement("input");
        input.type = "text";
        cell.appendChild(input);
    }

    updateTableButtonStatus(); // Update the status of table buttons
}

// Function to clear the table
export function clearTable() {
    const headerRow = document.getElementById("header-row");
    const tableBody = document.getElementById("replacement-table").getElementsByTagName('tbody')[0];

    headerRow.innerHTML = "";
    tableBody.innerHTML = "";
    updateTableButtonStatus(); // Update the status of table buttons
}

// Function to import data from a CSV file into the table
export function importCSV() {
    const headerRow = document.getElementById("header-row");
    const tableBody = document.getElementById("replacement-table").getElementsByTagName('tbody')[0];

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv";
    input.click();
    input.addEventListener("change", function(event) {
        const reader = new FileReader();
        reader.onload = function() {
            const csvText = reader.result;
            const rows = csvText.split("\n");
            clearTable(); // Clear existing table

            // Populate header row with CSV headers
            const headers = rows[0].split(",");
            headers.forEach(header => {
                const headerCell = document.createElement("th");
                headerCell.textContent = header;
                headerCell.addEventListener("contextmenu", function(e) {
                    e.preventDefault();
                    showContextMenu(e.pageX, e.pageY, "header", headerCell);
                });
                headerRow.appendChild(headerCell);
            });

            // Populate table body with CSV rows
            for (let i = 1; i < rows.length; i++) {
                if (rows[i]) {
                    const newRow = tableBody.insertRow();
                    newRow.addEventListener("contextmenu", function(e) {
                        e.preventDefault();
                        showContextMenu(e.pageX, e.pageY, "row", newRow);
                    });

                    const cells = rows[i].split(",");
                    cells.forEach(cell => {
                        const cellElement = newRow.insertCell();
                        const input = document.createElement("input");
                        input.type = "text";
                        input.value = cell;
                        cellElement.appendChild(input);
                    });
                }
            }

            // Enable buttons after import
            updateTableButtonStatus();
            showToast('CSV import successful!', 3000);
        };
        reader.readAsText(event.target.files[0]);
    });
}

// Function to export table data to a CSV file
export function exportCSV() {
    const headerRow = document.getElementById("header-row");
    const tableBody = document.getElementById("replacement-table").getElementsByTagName('tbody')[0];

    let csvContent = "data:text/csv;charset=utf-8,";
    const headerCells = Array.from(headerRow.cells);
    const headerArray = headerCells.map(cell => cell.textContent);
    csvContent += headerArray.join(",") + "\r\n";

    // Convert table rows to CSV format
    for (let row of tableBody.rows) {
        let rowArray = [];
        for (let cell of row.cells) {
            const input = cell.querySelector("input");
            rowArray.push(input ? input.value : cell.textContent);
        }
        csvContent += rowArray.join(",") + "\r\n";
    }

    // Create and trigger a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table.csv");
    document.body.appendChild(link);
    link.click();

    showToast('CSV export successful!', 3000);
}
