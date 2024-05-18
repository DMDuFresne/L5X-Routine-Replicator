// Function to show the spinner overlay
export function showSpinner() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";
}

// Function to hide the spinner overlay
export function hideSpinner() {
    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";
}

// Add event listener for custom 'ajaxStart' event to show the spinner
document.addEventListener("ajaxStart", showSpinner);

// Add event listener for custom 'ajaxStop' event to hide the spinner
document.addEventListener("ajaxStop", hideSpinner);
