let _custom_dict = [];  // Declare _custom_dict as an array

// Fetch custom dictionary file
fetch("userdict.txt")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(text => {
        // Split text into lines and parse into _custom_dict
        let lines = text.split('\n');
        lines.forEach(line => {
            let word = line.trim();
            if (word) {  // Ensure word is not empty
                _custom_dict.push([word, 99999999, 'n']); // Default frequency and part-of-speech tag (modify as needed)
            }
        });

        console.log('Custom dictionary loaded:', _custom_dict);

        // Setup jieba-js with custom dictionary
        setupJiebaWithCustomDict();
    })
    .catch(error => {
        console.error('Error fetching file:', error);
    });

// Function to setup jieba-js with custom dictionary
function setupJiebaWithCustomDict() {
    // Include jieba-js library dynamically
    var script = document.createElement('script');
    script.src = 'https://pulipulichen.github.io/jieba-js/require-jieba-js.js';
    document.head.appendChild(script);

    // Wait until jieba-js is loaded
    script.onload = function () {
        // Set custom dictionary for jieba-js
        window.JIEBA_CUSTOM_DICTIONARY = _custom_dict;

        // Example usage with jieba-js after setup
        let _text = "你好方東";
        call_jieba_cut(_text, _custom_dict, function (_result) {
            console.log('Segmented result:', _result);
           
         
        });
    };
}