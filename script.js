// Function to load scripts dynamically after content is injected
function executeScripts(content) {
    const scriptTags = content.querySelectorAll('script');
    scriptTags.forEach(script => {
        const newScript = document.createElement('script');
        newScript.textContent = script.textContent; // Inline script content
        if (script.src) {
            newScript.src = script.src; // For external scripts
        }
        document.body.appendChild(newScript);
        document.body.removeChild(newScript); // Clean up after execution
    });
}

// JavaScript to load pages dynamically into the content area
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default navigation
        const page = this.getAttribute('data-page'); // Get the target page
        const contentDiv = document.getElementById('content');

        // Fetch and display the content
        fetch(page)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load ${page}`);
                }
                return response.text();
            })
            .then(data => {
                const tempDiv = document.createElement('div'); // Temporary container for HTML parsing
                tempDiv.innerHTML = data;

                // Replace content
                contentDiv.innerHTML = tempDiv.innerHTML;

                // Execute scripts inside the new content
                executeScripts(tempDiv);
            })
            .catch(error => {
                contentDiv.innerHTML = `<p>Error loading the page: ${error.message}</p>`;
            });
    });
});
