// Function to sanitize the filename by removing invalid characters
export function sanitizeFilename(input) {
    return input.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '');
}

// Function to update the status of table-related buttons based on the presence of columns
export function updateTableButtonStatus() {
    const headerRow = document.getElementById("header-row");
    const addRowButton = document.getElementById("add-row");
    const hasColumns = headerRow.cells.length > 0;
    
    // Enable or disable buttons based on the presence of columns in the header row
    addRowButton.disabled = !hasColumns;
    document.getElementById('clear-table').disabled = !hasColumns;
    document.getElementById('export-csv').disabled = !hasColumns;
}

// Function to update the status of file-related buttons based on the presence of a selected file
export function updateFileButtonStatus() {
    const fileInput = document.getElementById("file");
    const convertButton = document.getElementById("convert-button");
    const modifyButton = document.getElementById("modify-button");
    const hasFile = fileInput.files.length > 0;
    
    // Enable or disable buttons based on whether a file is selected
    convertButton.disabled = !hasFile;
    modifyButton.disabled = !hasFile;
}
