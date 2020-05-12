//v1
const fs = require('fs')
const { createCanvas } = require('canvas')
const tf = require('@tensorflow/tfjs');
const deepai = require('deepai');
deepai.setApiKey('d445b643-fb85-4816-ac2d-95a0e660fe81');



function randomint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
class abstractANN {
    constructor({ canvasID } = {}) {

        tf.enableProdMode();

        // constants
        this.WIDTH = 100;   // linear resolution
        this.H = 8;         // number of neurons in hidden layers

        // mouse and trackpad input processing
        this.mouseX = 0;
        this.mouseY = 0;
        // attach mousemove and touch move events
        // input and weights
        this.input = [];
        this.inputTensorXY;
        // temporal inputs
        this.t = 0;
        // temporal input steps (determines frequency)
        this.tSTEP = Math.PI / 800;
        // temoral componenent magnitude
        this.tMagnitude = tf.scalar(1.2);
        // layer magnitude
        //this.lMagnitude = tf.scalar(1);

        // create hidden canvas to generate wallpaper and convert to image
        this.HIDDENWIDTH = 1920;
        this.HIDDENHEIGHT = 1080;
        this.hiddenCanvas = createCanvas(this.HIDDENWIDTH, this.HIDDENHEIGHT)

        // this.hiddenCanvas.width = this.HIDDENWIDTH;
        // this.hiddenCanvas.height = this.HIDDENHEIGHT;
        this.ctx = this.hiddenCanvas.getContext('2d');

        // the wallpaper is pretty high-res, so we'll generate the image batch-by-batch
        // number of batches
        this.numBatches = 10;
        // initialize random weights
        this.w1 = tf.randomNormal([5, this.H]); // x, y + mouse.x, mouse.y + 1 temporal input
        this.w2 = tf.randomNormal([this.H, this.H]);
        this.w3 = tf.randomNormal([this.H, this.H]);
        this.w4 = tf.randomNormal([this.H, 3]); // 3 outputs (rgb)
        this.magnitude1 = tf.scalar(`${randomint(1000,6200)/1000}`, 'float32');
        this.magnitude2 = tf.scalar(`${randomint(1000,6200)/1000}`, 'float32');
        this.magnitude3 = tf.scalar(`${randomint(1000,6200)/1000}`, 'float32');

        this.tMagnitude = tf.scalar(1.2);
        this.t = 0;
        this.mouseY = randomint(0,3200)/1000;
        this.mouseX = randomint(0,3200)/1000;

        this.ACTIVATION = {
            'cos': (input) => input.cos(),
            'sin': (input) => input.sin(),
            'tanh': (input) => input.tanh(),
            'lin': (input) => input,
            'cosh': (input) => input.cosh(),
            'sinh': (input) => input.sinh(),
        };
        var formular = ["sin", "cos", "tanh", "lin", "cosh", "sinh"];
        this.activation1 = this.ACTIVATION[formular[randomint(0,5)]];
        this.activation2 = this.ACTIVATION[formular[randomint(0,5)]];
        this.activation3 = this.ACTIVATION[formular[randomint(0,5)]];
        this.activation4 = this.ACTIVATION[formular[randomint(0,5)]];







        // run flag
        this.runFlag = false;

    }

    generateInputs() {
        this.input = [];
        // generate matrix of all (x,y) combinations
        for (let i = 0; i < this.WIDTH; i++) {
            for (let j = 0; j < this.WIDTH; j++) {
                this.input.push([i / this.WIDTH, j / this.WIDTH]); //i*j/width/width
            }
        }
        this.inputTensorXY = tf.tensor2d(this.input, [this.WIDTH * this.WIDTH, 2], 'float32');
    }

    generateWeights() {
        // initialize random weights
        this.w1 = tf.randomNormal([5, this.H]); // x, y + mouse.x, mouse.y + 1 temporal input
        this.w2 = tf.randomNormal([this.H, this.H]);
        this.w3 = tf.randomNormal([this.H, this.H]);
        this.w4 = tf.randomNormal([this.H, 3]); // 3 outputs (rgb)
    }


    start() {
        this.inputTensorXY.dispose();
        this.w1.dispose();
        this.w2.dispose();
        this.w3.dispose();
        this.w4.dispose();
        this.generateInputs();
        this.generateWeights();

    }

    continue() {
        this.runFlag = true;
    }

    stop() {
        this.runFlag = false;
    }


    ///////////////////////////////////////////////////////////////////

    genfixed() {
        // console.log(this.HIDDENHEIGHT)
        // console.log(this.numBatches)
        this.numBatches = 10;
        this.generateWeights()
        this.magnitude1 = tf.scalar(`${randomint(100,620)/100}`, 'float32');
        this.magnitude2 = tf.scalar(`${randomint(100,620)/100}`, 'float32');
        this.magnitude3 = tf.scalar(`${randomint(100,620)/100}`, 'float32');

        this.tMagnitude = tf.scalar(1.2);
        this.t = 0;
        
        this.mouseY = randomint(0,3200)/1000;
        this.mouseX = randomint(0,3200)/1000;

        this.ACTIVATION = {
            'cos': (input) => input.cos(),
            'sin': (input) => input.sin(),
            'tanh': (input) => input.tanh(),
            'lin': (input) => input
        };
        var formular = ["sin", "cos", "tanh", "lin"];
        this.activation1 = this.ACTIVATION[formular[randomint(0,3)]];
        this.activation2 = this.ACTIVATION[formular[randomint(0,3)]];
        this.activation3 = this.ACTIVATION[formular[randomint(0,3)]];
        this.activation4 = this.ACTIVATION[formular[randomint(0,3)]];


    }


    ////////////////////////////////////////////////////////////////////

    // Method to generate higher resolution wallpaper
    saveHighResFrame(name) {
        let outputHighRes = [];
        this.runFlag = false;
        this.generateInputs();
        this.genfixed();


        // // generate matrix of all (x,y) combinations
        for (let batch = 0; batch < this.HIDDENHEIGHT / this.numBatches; batch++) {
            let row = [];
            for (let i = 0; i < this.numBatches; i++) {
                for (let j = 0; j < this.HIDDENWIDTH; j++) {
                    row.push([(batch * this.numBatches + i) / this.HIDDENHEIGHT, j / this.HIDDENHEIGHT]); //i*j/width/width
                }
            }
            let outputRowRGB = tf.tidy(() => {
                // add sine of temporal inputs, broadcast along the first axis, concatenate with input tensor
                let inputRowTensor = tf.concat([
                    tf.tensor2d(row, [this.HIDDENWIDTH * this.numBatches, 2], 'float32'),
                    tf.tensor2d([this.mouseX, this.mouseY, Math.sin(this.t)], [1, 3]).mul(this.tMagnitude).tile([this.HIDDENWIDTH * this.numBatches, 1])
                ], 1);

                // perform forward propagation and return rgb result
                let z1 = inputRowTensor.matMul(this.w1);
                let a1 = this.activation1(z1).mul(this.magnitude1);
                let z2 = a1.matMul(this.w2);
                let a2 = this.activation2(z2).mul(this.magnitude2);
                let z3 = a2.matMul(this.w3);
                let a3 = this.activation3(z3).mul(this.magnitude3);
                let z4 = a3.matMul(this.w4);
                let a4 = this.activation4(z4);
                let output = a4.mul(tf.scalar(127.5)).add(tf.scalar(127.5)).floor();

                return (tf.concat([output, tf.tensor2d([255], [1, 1]).tile([this.HIDDENWIDTH * this.numBatches, 1])], 1));
            });

            let tempArray = outputRowRGB.dataSync();
            outputRowRGB.dispose();
            // outputHighRes.push(...tempArray); // doesn't work on ipad (call stack issues)
            for (let i = 0; i < tempArray.length; i++) { outputHighRes.push(tempArray[i]); }
        }

        let idata = this.ctx.createImageData(this.HIDDENWIDTH, this.HIDDENHEIGHT);
        idata.data.set(Uint8ClampedArray.from(outputHighRes));
        this.ctx.putImageData(idata, 0, 0);



        // // display generated image as saveable thumbnail
        // let image = document.createElement('img');
        // var image = this.hiddenCanvas.toDataURL("image/jpeg");
        const buffer = this.hiddenCanvas.toBuffer('image/png')
        fs.writeFileSync(`./${name}.png`, buffer)
        // resume running
        this.runFlag = true;
    }


}

function paint(img, style) {
    (async function () {
        var resp = await deepai.callStandardApi("deepdream", {
            image: fs.createReadStream(`./${img}`),
        });
        //console.log(resp.output_url);
       var url = resp.output_url;
        (async function () {
            var resp = await deepai.callStandardApi("CNNMRF", {
                content: url,
                style: fs.createReadStream(`./${style}`),
            });
            console.log(resp);
        })()
    })()
}

cppn = new abstractANN({
    canvasID: 'canvas'
});
// cppn.saveHighResFrame("cppn1");
// var url = "";

// paint("cppn1.png", "art_Style.png");

module.exports = {
    cppn: cppn,
    paint: paint
}