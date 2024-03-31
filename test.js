const CodeRunner = require('coderunner');
const codeRunner = new CodeRunner();

// Define the code you want to execute
const code = `
var x=5 ;
    console.log('Hello, world!',x);
`;

// Specify the language of the code
const language = 'javascript'; // Change this to the desired language

// Execute the code
codeRunner.run(language, code)
    .then(result => {
        console.log('Execution result:', result);
    })
    .catch(error => {
        console.error('Error executing code:', error);
    });