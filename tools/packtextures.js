const fs = require('fs');
const path = require('path');
const { packAsync } = require('free-tex-packer-core');

const rootDir = path.join(__dirname, '../assets/raw_assets');
const outputDir = path.join(__dirname, '../assets/atlas');

// Đảm bảo thư mục đầu ra tồn tại
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Lấy danh sách các thư mục con trong thư mục gốc
const subDirs = fs.readdirSync(rootDir).filter(file => fs.statSync(path.join(rootDir, file)).isDirectory());

async function packImagesInDir(dir) {
    // Đọc tất cả các file PNG trong thư mục ảnh
    const imgDir = path.join(rootDir, dir);
    const imageFiles = fs.readdirSync(imgDir).filter(file => file.endsWith('.png'));

    // Chuyển đổi danh sách file thành định dạng mà packAsync cần
    const images = imageFiles.map(file => ({
        path: path.relative(__dirname, path.join(imgDir, file)), // Sử dụng đường dẫn tương đối
        contents: fs.readFileSync(path.join(imgDir, file)),
        name: path.basename(file, '.png') // Loại bỏ phần mở rộng .png
    }));

    try {
        // Gói các hình ảnh thành một atlas
        const files = await packAsync(images, {
            format: 'json', // Định dạng đầu ra
            prefix: ''
        });

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
                json.meta.image = `${dir}-pack-result.png`;

                // Đổi tên file JSON
                const newJsonFileName = `${dir}-pack-result.json`;

                // Lưu lại file JSON đã chỉnh sửa với tên mới
                fs.writeFileSync(path.join(outputDir, newJsonFileName), JSON.stringify(json, null, 2));
            } else {
                // Đổi tên file bằng cách thêm tiền tố là tên thư mục cộng với tên mặc định
                const newFileName = `${dir}-${file.name}`;
                fs.writeFileSync(path.join(outputDir, newFileName), file.buffer);
            }
        });

        console.log(`Packing and renaming completed successfully for directory: ${dir}`);
    } catch (error) {
        console.error(`Error packing images in directory ${dir}:`, error);
    }
}

async function packAllDirs() {
    for (const dir of subDirs) {
        await packImagesInDir(dir);
    }
}

packAllDirs();