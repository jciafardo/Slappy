document.addEventListener('DOMContentLoaded', () => {
    // Get feedback element
    const feedback = document.getElementById('feedback');
    

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show feedback message
            feedback.innerText = text + " copied to clipboard"
            feedback.style.display = 'block';
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 2000); // Hide feedback after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    // Add event listeners to copy icons
    document.querySelectorAll('.sidebar img').forEach(img => {
        img.addEventListener('click', (e) => {
            const text = e.target.parentElement.getAttribute('data-text');
            copyToClipboard(text);
        });
    });
});