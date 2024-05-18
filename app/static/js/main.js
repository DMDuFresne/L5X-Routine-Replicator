import { sanitizeFilename, updateTableButtonStatus, updateFileButtonStatus } from './domUtils.js';
import { addColumn, addRow, clearTable, importCSV, exportCSV } from './table.js';
import { uploadAndProcess, initializeFileUpload } from './fileUpload.js';
import { generateTreeView, expandAll, collapseAll } from './treeView.js';
import { showSpinner, hideSpinner } from './spinner.js';
import { showToast } from './toast.js';

document.addEventListener("DOMContentLoaded", function() {
    const convertButton = document.getElementById("convert-button");
    const modifyButton = document.getElementById("modify-button");
    const jsonDisplay = document.getElementById("json-display");

    // Attach event listeners to table and CSV buttons
    document.getElementById("clear-table").addEventListener("click", clearTable);
    document.getElementById("add-row").addEventListener("click", addRow);
    document.getElementById("add-column").addEventListener("click", addColumn);
    document.getElementById("import-csv").addEventListener("click", importCSV);
    document.getElementById("export-csv").addEventListener("click", exportCSV);

    // Attach event listeners to tree view buttons
    document.getElementById("expandAllBtn").addEventListener("click", expandAll);
    document.getElementById("collapseAllBtn").addEventListener("click", collapseAll);

    // Attach event listener to file input
    document.getElementById("file").addEventListener("input", updateFileButtonStatus);

    // Custom event listener for file selection
    document.addEventListener('file-selected', updateFileButtonStatus);

    // Initialize file upload functionality
    initializeFileUpload('drop-zone', 'file');

    // Event Listener for Convert button
    convertButton.addEventListener("click", async function() {
        try {
            const response = await uploadAndProcess("/convert");
            const contentType = response.headers.get("Content-Type");

            if (response.ok && contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                jsonDisplay.innerHTML = '';
                jsonDisplay.appendChild(generateTreeView(data, true));
                showToast('Conversion successful!', 3000);
            } else {
                const errorText = await response.text();
                showToast(`Conversion failed: ${errorText}`, 5000);
            }
        } catch (error) {
            showToast(`Conversion failed: ${error.message}`, 5000);
        }
    });

    // Event Listener for Modify button
    modifyButton.addEventListener("click", async function() {
        showSpinner();

        try {
            const response = await uploadAndProcess("/modify");
            const contentType = response.headers.get("Content-Type");

            if (response.ok) {
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                    jsonDisplay.innerText = JSON.stringify(data, null, 2);
                    showToast('Modification successful!', 3000);
                } else {
                    const programNameInput = document.getElementById("program-name");
                    let programName = programNameInput.value.trim();
                    programName = sanitizeFilename(programName);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.style.display = "none";
                    a.href = url;
                    a.download = programName ? programName + ".l5x" : "modified_file.l5x";
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    showToast('File downloaded successfully!', 3000);
                }
            } else {
                const errorText = await response.text();
                showToast(`Modification failed: ${errorText}`, 5000);
            }
        } catch (error) {
            showToast(`Modification failed: ${error.message}`, 5000);
        } finally {
            hideSpinner();
        }
    });

    // Initialize the 'Rows' and 'Clear' buttons as disabled
    updateTableButtonStatus();
    updateFileButtonStatus();
});
