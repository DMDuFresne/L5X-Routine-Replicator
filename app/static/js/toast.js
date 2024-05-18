// Function to show a toast notification with a specified message and duration
export function showToast(message, duration = 5000) {
    const toastContainer = document.getElementById('toast-container');
    
    // Check if the toast container exists
    if (!toastContainer) {
        console.error('Toast container not found');
        return;
    }

    // Create a new toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Add click event listener to remove the toast when clicked
    toast.addEventListener('click', () => {
        toastContainer.removeChild(toast);
    });

    // Append the toast to the toast container
    toastContainer.appendChild(toast);

    // Remove the toast after the specified duration
    setTimeout(() => {
        if (toastContainer.contains(toast)) {
            toastContainer.removeChild(toast);
        }
    }, duration);
}
