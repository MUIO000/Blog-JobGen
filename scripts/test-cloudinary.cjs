const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration from .env
const CLOUD_NAME = 'djoieqzi6';
const UPLOAD_PRESET = 'JobGen-Blog';

// Test image path
const imagePath = path.join(__dirname, '../src/pages/images/article-images/article-1.jpg');

if (!fs.existsSync(imagePath)) {
    console.error('Test image not found at:', imagePath);
    // Try to find any jpg file in the directory
    const dirPath = path.dirname(imagePath);
    if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        const jpg = files.find(f => f.endsWith('.jpg'));
        if (jpg) {
            console.log('Found alternative image:', jpg);
            // Update imagePath logic if needed, but for now just exit if specific file not found
        }
    }
    process.exit(1);
}

console.log('Testing Cloudinary upload...');
console.log('Cloud Name:', CLOUD_NAME);
console.log('Upload Preset:', UPLOAD_PRESET);

// Create form data boundary
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

// Read file
const fileData = fs.readFileSync(imagePath);

// Construct body parts
const preFile = Buffer.from(
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="upload_preset"\r\n\r\n` +
    `${UPLOAD_PRESET}\r\n` +
    `--${boundary}\r\n` +
    `Content-Disposition: form-data; name="file"; filename="test-image.jpg"\r\n` +
    `Content-Type: image/jpeg\r\n\r\n`
);

const postFile = Buffer.from(`\r\n--${boundary}--\r\n`);

const payload = Buffer.concat([preFile, fileData, postFile]);

const options = {
    hostname: 'api.cloudinary.com',
    path: `/v1_1/${CLOUD_NAME}/image/upload`,
    method: 'POST',
    headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const response = JSON.parse(data);
            console.log('✅ Upload Successful!');
            console.log('Secure URL:', response.secure_url);
        } else {
            console.error('❌ Upload Failed!');
            console.error('Status Code:', res.statusCode);
            console.error('Response:', data);
        }
    });
});

req.on('error', (e) => {
    console.error('Request Error:', e);
});

req.write(payload);
req.end();
