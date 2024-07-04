let _custom_dict = [];  // Declare _custom_dict as an array
let resultObject = {}
// Fetch custom dictionary file
fetch("userdict.txt")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(text => {
        //console.log('Fetched text:', text);  // Log fetched text for debugging

        // Split text into lines and parse into _custom_dict
        let lines = text.split('\n');
        lines.forEach(line => {
            let word = line.trim();
            if (word) {  // Ensure word is not empty
                _custom_dict.push([word, 99999999, 'n']); // Default frequency and part-of-speech tag (modify as needed)
            }
        });

        //console.log('Custom dictionary loaded:', _custom_dict);

        // Setup jieba-js with custom dictionary

    })
    .catch(error => {
        console.error('Error fetching file:', error);
    });

// Function to setup jieba-js with custom dictionary




function jiebaSegment(inPut, callback) {
    // Include jieba-js library dynamically
    var script = document.createElement('script');
    script.src = 'https://pulipulichen.github.io/jieba-js/require-jieba-js.js';
    document.head.appendChild(script);

    // Wait until jieba-js is loaded
    script.onload = function () {
        // Set custom dictionary for jieba-js
        window.JIEBA_CUSTOM_DICTIONARY = _custom_dict;

        // Example usage with jieba-js after setup
        call_jieba_cut(inPut, _custom_dict, function (_result) {
            if (callback) {
                callback(_result); // Pass _result to the callback function           
            }
        });
    };
}


function doSegmentAndLookup() {


    //console.log("Input text:", inputText); // Debug: Log input text

    // Assuming 'textInput' is the ID of your input element in the HTML
    let inputTextElement = document.getElementById('textInput');

    // Get the value from the input element
    let inputText = inputTextElement.value;

    // Remove newline characters from inputText
    let cleanedInput = inputText.replace(/[^\u4E00-\u9FFFa-zA-Z0-9]/g, '');
    jiebaSegment(cleanedInput, function (_result) {
        //console.log("Returned result:", _result); // Debug: Log _result array/object
        //console.log("Result length:", _result.length); // Debug: Log _result length

        // Update the <div> with id "result"
        var resultDiv = document.getElementById('segment-result');
        if (resultDiv) {
            //resultDiv.textContent = JSON.stringify(_result); // Update content as JSON string
        }
        init(_result)
    });

}

async function fetchCSV(url) {
    const response = await fetch(url);
    const data = await response.text();
    return data;
}

function parseCSV(data) {
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');

    const result = [];
    for (let i = 1; i < lines.length; i++) {
        const currentline = lines[i].split(',');

        // Skip empty lines or lines that don't have the same number of elements as headers
        if (currentline.length !== headers.length) continue;

        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j].trim();
        }
        result.push(obj);
    }
    return result;
}

function checkVocab(words, vocabList) {
    const result = {};
    words.forEach(word => {
        const vocab = vocabList.find(v => v['生詞'] === word);
        if (vocab) {
            result[word] = { 冊: vocab['冊'], '課-序號': vocab['課-序號'] };
        } else {
            result[word] = { 冊: 'N/A', '課-序號': 'N/A' };
        }
    });
    return result;
}

function displayResult(result) {
    const resultDiv = document.getElementById('lookup-result');
    resultDiv.innerHTML = ''; // Clear previous results

    for (const [word, info] of Object.entries(result)) {
        const p = document.createElement('p');
        p.textContent = `${word}: 冊 ${info['冊']}, 課-序號 ${info['課-序號']}`;
        resultDiv.appendChild(p);
    }
}

async function init(words) {

    const csvData = await fetchCSV('all_vocabs.csv');
    const vocabList = parseCSV(csvData);
    const result = checkVocab(words, vocabList);
    resultObject = result
    displayResult(result);

}

function sortResults(result) {
    return Object.entries(result).sort((a, b) => {
        const [aWord, aInfo] = a;
        const [bWord, bInfo] = b;

        if (aInfo['冊'] !== bInfo['冊']) {
            return aInfo['冊'] - bInfo['冊'];
        }

        return aInfo['課-序號'] - bInfo['課-序號'];
    });
}



function displaySorted(result) {
    //console.log('Hello displaySortedRunned')
    const resultDiv = document.getElementById('lookup-result');
    resultDiv.innerHTML = ''; // Clear previous results

    // Sort the results before displaying
    const sortedResults = sortResults(result);
    for (const [word, info] of sortedResults) {
        const p = document.createElement('p');
        p.textContent = `${word}: 冊 ${info['冊']}, 課-序號 ${info['課-序號']}`;
        resultDiv.appendChild(p);
    }
}




function doDisplaySorted() {
    console.log('Do Sorted Runned')
    displaySorted(resultObject)
}






