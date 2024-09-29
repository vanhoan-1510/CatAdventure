const fs = require('fs');
const path = require('path');
const { packAsync } = require('free-tex-packer-core');

const imgDir = path.join(__dirname, '../assets/raw_atlas/fishes');
const outputDir = path.join(__dirname, '../assets/atlas');

// Đảm bảo thư mục đầu ra tồn tại
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Đọc tất cả các file PNG trong thư mục ảnh
const imageFiles = fs.readdirSync(imgDir).filter(file => file.endsWith('.png'));

// Chuyển đổi danh sách file thành định dạng mà packAsync cần
const images = imageFiles.map(file => ({
    path: path.relative(__dirname, path.join(imgDir, file)), // Sử dụng đường dẫn tương đối
    contents: fs.readFileSync(path.join(imgDir, file)),
    name: path.basename(file, '.png') // Loại bỏ phần mở rộng .png
}));

async function packImages() {
    try {
        // Gói các hình ảnh thành một atlas
        const files = await packAsync(images, {
            format: 'json', // Định dạng đầu ra
            prefix: ''
        });

        // Lấy tên thư mục
        const dirName = path.basename(imgDir);

        // Chỉnh sửa tên frame trong file JSON
        files.forEach(file => {
            if (path.extname(file.name) === '.json') {
                const json = JSON.parse(file.buffer.toString());

                // Tạo một bản sao của đối tượng frames với tên frame không có phần mở rộng
                const newFrames = {};
                Object.keys(json.frames).forEach(key => {
                    const newKey = path.basename(key, '.png');
                    newFrames[newKey] = json.frames[key];
                });

                json.frames = newFrames;

                // Thay đổi giá trị của trường "image" trong phần "meta"
                json.meta.image = `${dirName}_pack-result.png`;

                // Đổi tên file JSON
                const newJsonFileName = `${dirName}_pack-result.json`;

                // Lưu lại file JSON đã chỉnh sửa với tên mới
                fs.writeFileSync(path.join(outputDir, newJsonFileName), JSON.stringify(json, null, 2));
            } else {
                // Đổi tên file bằng cách thêm tiền tố là tên thư mục cộng với tên mặc định
                const newFileName = `${dirName}_${file.name}`;
                fs.writeFileSync(path.join(outputDir, newFileName), file.buffer);
            }
        });

        console.log('Packing and renaming completed successfully.');
    } catch (error) {
        console.error('Error packing images:', error);
    }
}

packImages();