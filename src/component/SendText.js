import { useState } from 'react'; // Assuming you're using React

function SendText() {
    const [textInput, setTextInput] = useState('');

    // Function to handle sending text to the API
    const textSend = async () => {
        try {
            // Make a POST request to your API endpoint
            const response = await fetch('your-api-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: textInput })
            });

            // Handle response
            if (response.ok) {
                // Do something if the request was successful
            } else {
                // Handle errors if any
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Function to handle input change
    const handleInputChange = (event) => {
        setTextInput(event.target.value);
    };

    return (
        <form className="max-w-md mx-auto mb-20 mt-0">
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Send</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"></div>
                <input
                    type="search"
                    id="default-search"
                    className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    value={textInput}
                    onChange={handleInputChange}
                />
                <button
                    onClick={textSend}
                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Send
                </button>
            </div>
        </form>
    );
}

export default SendText;
