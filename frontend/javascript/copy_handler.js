document.addEventListener('DOMContentLoaded', () => {
    // Get feedback element
    const feedback = document.getElementById('feedback');

    async function getCopiedText() {
        const apiUrl = 'http://localhost:3000/getAllCopiedText';

        try {
            const response = await axios.get(apiUrl);
            // Handle success
            console.log('Data:', response.data); // This is your JSON object
            return response.data;
        } catch (error) {
            // Handle error
            console.error('Error fetching data:', error);
            return {"dataErrorMessage": "There is a problem with our servers we are working to fix this"}; // Return an empty object on error
        }
    }

    async function displayCopiedText() {
        const listElement = document.getElementById('copied-text-list'); // Get the placeholder element
         
        
        // Clear any existing content
        listElement.innerHTML = '';

        // Get the copied text JSON object
        const copiedTextObject = await getCopiedText(); // Await the asynchronous function
        const entries = Object.entries(copiedTextObject);
        if (copiedTextObject.hasOwnProperty('fileReadingError')) {
            const listItem = document.createElement('li');
            listItem.textContent = copiedTextObject['fileReadingError']
            listElement.appendChild(listItem)
          } 

        else if (copiedTextObject.hasOwnProperty('dataErrorMessage')){
            const listItem = document.createElement('li');
            listItem.textContent = copiedTextObject['dataErrorMessage']
            listElement.appendChild(listItem)
        }

        // check if there is any text user has copied 
        else if(entries.length < 1){
            const listItem = document.createElement('li');
            listItem.textContent = "You have not copied any text yet."
            listElement.appendChild(listItem)
        }
        else{
        // Iterate over the key-value pairs of the JSON object and create list items
       entries.forEach(([key, value]) => {
            const listItem = document.createElement('li'); // Create a new list item
            listItem.textContent = key; // Set the text content
            listItem.setAttribute("data-text", value);
            
            const copyIcon = document.createElement('img');
            copyIcon.setAttribute('src', './icons/copy.svg'); // Set the source of the image
            
            
            listElement.appendChild(listItem); // Add the list item to the placeholder
            
            listItem.appendChild(copyIcon); // Add the icon to the list item
            
        
        })
    };

        // Add event listeners to copy icons
        document.querySelectorAll('#copied-text-list img').forEach(img => {
            img.addEventListener('click', (e) => {
                const text = e.target.parentElement.getAttribute('data-text');
                const label = e.target.parentElement.textContent.trim()
                copyToClipboard(text, label);
            });
        });
    }

    // Function to copy text to clipboard
    function copyToClipboard(text, label) {
        navigator.clipboard.writeText(text).then(() => {
            // Show feedback message
            feedback.innerText = label + " copied to clipboard";
            feedback.style.display = 'block';
            setTimeout(() => {
                feedback.style.display = 'none';
            }, 2000); // Hide feedback after 2 seconds
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

      // Declare addText function globally
      window.addText = async function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
    
        const label = document.getElementById('label').value;
        const value = document.getElementById('value').value;
    
        try {
            // Create file and folder if they don't exist, otherwise return their IDs
            await createFileAndFolder();
    
            const addTextApiUrl = `http://localhost:3000/addCopiedText`;
    
            // Make the request to the API using axios
            const response = await axios.put(addTextApiUrl, {
                label: label,
                value: value
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                console.log('API Response:', response.data);
                location.reload();
            } else {
                console.error('API request failed:', response.statusText);
                alert('Failed to add text. Please try again.');
            }
        } catch (error) {
            console.error('Error during processing:', error);
            alert('An error occurred while processing your request.');
        }
    };

    window.deleteText = async function() {
        const deleteTextApiUrl = 'http://localhost:3000/deleteCopiedText';
    
        try {
            // Make the request to the API using axios
            const response = await axios.put(deleteTextApiUrl);
    
            if (response.status === 200) {
                console.log('API Response:', response.data);
                location.reload(); // Reload the page to reflect changes
            } else {
                console.error('API request failed:', response.statusText);
                alert('Failed to delete text. Please try again.');
            }
        } catch (error) {
            console.error('Error during processing:', error);
            alert('An error occurred while processing your request.');
        }
    };
      
    
    

    async function createFileAndFolder(){
        const createFolderApiUrl = 'http://localhost:3000/createFileAndFolder'

        try {
            const response = await axios.post(createFolderApiUrl);
            // Handle success
            console.log('Data:', response.data); // This is your JSON object
            return response.data;
        } catch (error) {
            // Handle error
            console.error('Error fetching data:', error);
            return {"dataErrorMessage": "There is a problem with our servers we are working to fix this"}; // Return an empty object on error
        }

    }

    displayCopiedText();
    

});
