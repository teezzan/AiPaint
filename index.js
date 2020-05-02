const fs = require('fs');

const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML

deepai.setApiKey('d445b643-fb85-4816-ac2d-95a0e660fe81');

(async function() {
    var resp = await deepai.callStandardApi("deepdream", {
            image: fs.createReadStream("/path/to/your/file.jpg"),
    });
    console.log(resp);
})()


////////////////////////////////////////////////////////////////////////
// Example posting a local image file (Node.js only):
const fs = require('fs');

const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML

deepai.setApiKey('d445b643-fb85-4816-ac2d-95a0e660fe81');

(async function() {
    var resp = await deepai.callStandardApi("neural-style", {
            style: fs.createReadStream("/path/to/your/file.jpg"),
            content: fs.createReadStream("/path/to/your/file.jpg"),
    });
    console.log(resp);
})()






// Example posting a local image file (Node.js only):
const fs = require('fs');

const deepai = require('deepai'); // OR include deepai.min.js as a script tag in your HTML

deepai.setApiKey('d445b643-fb85-4816-ac2d-95a0e660fe81');

(async function() {
    var resp = await deepai.callStandardApi("CNNMRF", {
            content: fs.createReadStream("/path/to/your/file.jpg"),
            style: fs.createReadStream("/path/to/your/file.jpg"),
    });
    console.log(resp);
})()



deepai.setApiKey('d445b643-fb85-4816-ac2d-95a0e660fe81');

(async function() {
    var resp = await deepai.callStandardApi("CNNMRF", {
            content: "YOUR_IMAGE_URL",
            style: "YOUR_IMAGE_URL",
    });
    console.log(resp);
})()
