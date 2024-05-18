import { updateFileButtonStatus } from './domUtils.js';
import { showToast } from './toast.js';

export function initializeFileUpload(dropZoneId, fileInputId) {
    const dropZone = document.getElementById(dropZoneId);
    const fileInput = document.getElementById(fileInputId);
    const fileNameDisplay = document.getElementById('file-name');

    // Trigger file input click when drop zone is clicked
    dropZone.addEventListener('click', () => fileInput.click());

    // Handle drag over event
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    // Handle drag leave event
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    // Handle drop event
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');

        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            if (validateFileType(file)) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect(file);
                updateFileButtonStatus();
                fileNameDisplay.textContent = file.name;
                showToast('File uploaded successfully!', 3000);
            } else {
                showToast('Invalid file type. Please upload an L5X file.', 5000);
            }
        }
    });

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        if (fileInput.files.length) {
            const file = fileInput.files[0];
            if (validateFileType(file)) {
                handleFileSelect(file);
                updateFileButtonStatus();
                fileNameDisplay.textContent = file.name;
                showToast('File uploaded successfully!', 3000);
            } else {
                showToast('Invalid file type. Please upload an L5X file.', 5000);
            }
        }
    });

    // Handle file selection event
    function handleFileSelect(file) {
        const event = new CustomEvent('file-selected', { detail: file });
        document.dispatchEvent(event);
    }

    // Validate the file type
    function validateFileType(file) {
        const validTypes = ['application/xml', 'text/xml', '.l5x'];
        const fileType = file.type.toLowerCase();
        const fileName = file.name.toLowerCase();
        return validTypes.includes(fileType) || fileName.endsWith('.l5x');
    }
}

export async function uploadAndProcess(url) {
    const fileInput = document.getElementById("file");
    const programNameInput = document.getElementById("program-name");
    const tableBody = document.getElementById("replacement-table").getElementsByTagName('tbody')[0];
    const headerRow = document.getElementById("header-row");
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    // Append program name to form data if provided
    const programName = programNameInput.value.trim();
    if (programName) {
        formData.append("programName", programName);
    }

    // Collect replacements from the table and append to form data
    let replacements = [];
    for (let row of tableBody.rows) {
        let replacement = {};
        for (let i = 0; i < headerRow.cells.length; i++) {
            const key = headerRow.cells[i].textContent;
            const value = row.cells[i].getElementsByTagName('input')[0].value;
            replacement[key] = value;
        }
        replacements.push(replacement);
    }
    formData.append("replacements", JSON.stringify(replacements));

    // Dispatch custom event for starting AJAX
    document.dispatchEvent(new Event("ajaxStart"));

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            redirect: 'follow'
        });

        if (!response.ok) {
            const errorText = await response.text();
            showToast(`Upload failed: ${errorText}`, 5000);
            throw new Error(errorText);
        }

        showToast('File processed successfully!', 3000);
        return response;
    } catch (error) {
        showToast(`Upload failed: ${error.message}`, 5000);
        throw error;
    } finally {
        // Dispatch custom event for stopping AJAX
        document.dispatchEvent(new Event("ajaxStop"));
    }
}
