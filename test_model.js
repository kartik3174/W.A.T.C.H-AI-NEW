const fs = require('fs');
const tf = require('@tensorflow/tfjs');
const tmImage = require('@teachablemachine/image');
const { createCanvas, loadImage } = require('canvas');

// Polyfill DOM for tmImage in node
global.document = {
    createElement: (tag) => {
        if (tag === 'canvas') return createCanvas(224, 224);
        return {};
    }
};

async function test() {
    console.log("Loading model...");
    // we need to serve it or read from file.
    // tmImage allows file:// urls or loading via fromJSON?
}
test();
