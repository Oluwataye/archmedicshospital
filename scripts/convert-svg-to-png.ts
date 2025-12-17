import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function convertSvgToPng() {
    try {
        const svgPath = path.join(process.cwd(), 'public', 'uploads', 'logos', 'hospital-logo-1765543637608-506638437.svg');
        const pngPath = path.join(process.cwd(), 'public', 'uploads', 'logos', 'hospital-logo.png');

        console.log('Converting SVG to PNG...');
        console.log('Input:', svgPath);
        console.log('Output:', pngPath);

        // Check if SVG exists
        if (!fs.existsSync(svgPath)) {
            console.error('SVG file not found!');
            process.exit(1);
        }

        // Convert SVG to PNG at 400x400 (high quality)
        await sharp(svgPath)
            .resize(400, 400, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
            })
            .png()
            .toFile(pngPath);

        console.log('✅ Conversion successful!');
        console.log('PNG file created at:', pngPath);
        console.log('\nNow you can upload this PNG file through the Settings page.');

        process.exit(0);
    } catch (error) {
        console.error('Error converting SVG to PNG:', error);
        process.exit(1);
    }
}

convertSvgToPng();
