import Jimp from 'jimp';

async function makeRoundedSquare(sourcePath, destPath, size, radius) {
    console.log(`Reading ${sourcePath}...`);
    const orig = await Jimp.read(sourcePath);
    
    // Create new image with dark background
    console.log(`Creating background image...`);
    const finalImage = new Jimp(size, size, 0x0f0c29ff); // dark navy with alpha=255
    
    // Add a slight gradient manually to background (optional)
    finalImage.scan(0, 0, size, size, function(x, y, idx) {
        // Simple linear gradient from 0x0f0c29 to 0x1a1a3e
        const ratio = y / size;
        const r = Math.floor(15 + ratio * (26 - 15));
        const g = Math.floor(12 + ratio * (26 - 12));
        const b = Math.floor(41 + ratio * (62 - 41));
        
        this.bitmap.data[idx] = r;
        this.bitmap.data[idx + 1] = g;
        this.bitmap.data[idx + 2] = b;
        this.bitmap.data[idx + 3] = 255;
    });

    console.log(`Scaling logo...`);
    orig.scaleToFit(size - 60, size - 60);
    const xPos = Math.floor((size - orig.bitmap.width) / 2);
    const yPos = Math.floor((size - orig.bitmap.height) / 2);
    
    console.log(`Compositing...`);
    // composite onto background
    finalImage.composite(orig, xPos, yPos);
    
    console.log(`Applying rounded corners...`);
    // Apply rounded corners mask
    finalImage.scan(0, 0, finalImage.bitmap.width, finalImage.bitmap.height, function(x, y, idx) {
        let dx = 0;
        let dy = 0;
        let corner = false;
        
        if (x < radius && y < radius) {
            dx = radius - x; dy = radius - y; corner = true; // top left
        } else if (x >= size - radius && y < radius) {
            dx = x - (size - radius) + 1; dy = radius - y; corner = true; // top right
        } else if (x < radius && y >= size - radius) {
            dx = radius - x; dy = y - (size - radius) + 1; corner = true; // bottom left
        } else if (x >= size - radius && y >= size - radius) {
            dx = x - (size - radius) + 1; dy = y - (size - radius) + 1; corner = true; // bottom right
        }
        
        if (corner) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > radius) {
                this.bitmap.data[idx + 3] = 0; // Transparent
            } else if (dist > radius - 1) {
                // antialiasing roughly
                this.bitmap.data[idx + 3] = Math.floor(255 * (radius - dist));
            }
        }
    });

    console.log(`Writing to ${destPath}...`);
    await finalImage.writeAsync(destPath);
    console.log(`Success! Saved to ${destPath}`);
}

makeRoundedSquare('./src/assets/logo.png', './src/assets/logo.png', 512, 112)
    .then(() => console.log('Finished logo transform.'))
    .catch(err => console.error('Error:', err));
