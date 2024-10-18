function createImage(daily, totalValue, downloadImage) {
    if (localStorage.getItem("position") === "ggz-admin" && !downloadImage) return;

    const canvas = document.createElement("canvas");

    function calculateCanvasHeight() {
        let totalHeight = 75;  // Bắt đầu từ giá trị top ban đầu
        daily.forEach((item) => {
            totalHeight += 75;  // Chiều cao cho mỗi tên đại lý
            item.items.forEach(() => {
                totalHeight += 165;  // Chiều cao cho mỗi sản phẩm
            });
        });

        return totalHeight + 300;  // Thêm khoảng trống bên dưới
    }

    // Khởi tạo lại top khi canvas thay đổi kích thước hoặc render lại
    function resizeCanvas() {
        canvas.width = 950;
        canvas.height = calculateCanvasHeight();

        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Xóa canvas trước khi vẽ

        ctx.fillStyle = 'white';  // Màu nền là trắng
        ctx.fillRect(0, 0, canvas.width, canvas.height);  // Vẽ hình chữ nhật phủ kín canvas

        let top = 75;  // Đặt lại top khi canvas được vẽ lại
        daily.forEach((item) => {
            top = createDaily(ctx, item.name, item.items, top);
        });

        ctx.beginPath();
        ctx.moveTo(50, top);
        ctx.lineTo(900, top);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#f0f0f";
        ctx.stroke();

        top += 50;

        ctx.beginPath();
        ctx.font = "24px Arial";
        ctx.fillText(`${totalValue.toLocaleString()}đ`, canvas.width / 2.3, top);
    }

    function createProduct(ctx, w, h, { name, value, quanity, img }, top) {
        let left = 100;
        ctx.beginPath();
        ctx.fillStyle = "#e6ecf5"
        ctx.fillRect(left, top + 10, w, h);

        const productImg = new Image();
        productImg.src = img;

        // Vẽ hình ảnh sản phẩm
        productImg.onload = () => {
            ctx.drawImage(productImg, left, top, w, h);  // Vẽ hình ảnh sản phẩm tại vị trí cố định `left`
            
        };

        // Các giá trị cột: tên, giá trị, số lượng
        const maxTextWidth = 150;  // Chiều rộng tối đa cho cột văn bản
        const lineHeight = 20;     // Chiều cao mỗi dòng khi xuống hàng

        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";

        // Vẽ tên sản phẩm và tự động xuống dòng nếu quá dài
        wrapText(ctx, name, left + 250, top + h / 2, maxTextWidth, lineHeight);  // Đưa name xuống hàng nếu cần

        ctx.fillText(`x${quanity}`, left + 500, top + h / 2);
        ctx.fillText(`${value.toLocaleString()} đ`, left + 650, top + h / 2);
        
        return top + h + 50;  // Trả lại giá trị mới của top sau khi vẽ sản phẩm
    }


    function createDaily(ctx, nameDaily, items, top) {
        // Vẽ tên đại lý
        ctx.beginPath();
        ctx.fillStyle = "#000";
        ctx.font = "21px Arial";
        ctx.fillText(nameDaily, 50, top);
        top += 50;  // Thêm khoảng cách sau tên đại lý
        
        // Vẽ danh sách sản phẩm và cập nhật top cho mỗi sản phẩm
        items.forEach(async (item) => {
            top = createProduct(ctx, 100, 100, item, top);  // Truyền top vào và cập nhật sau khi vẽ mỗi sản phẩm
        });

        top += 75;  // Bạn có thể điều chỉnh giá trị này để thay đổi khoảng cách giữa các đại lý

        return top;  // Trả lại top để cập nhật cho đại lý tiếp theo
        
    }



    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const maxLength = 57;
        if (text.length > maxLength) {
            text = text.substring(0, maxLength) + '........';
        }

        const words = text.split(' ');  // Tách văn bản thành các từ
        let line = '';
        let lines = [];

        words.forEach((word) => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;

            if (testWidth > maxWidth && line !== '') {
                lines.push(line);  // Nếu dòng quá dài, đưa nó thành một dòng mới
                line = word + ' ';
            } else {
                line = testLine;
            }
        });

        lines.push(line);  // Thêm dòng cuối cùng

        // Vẽ từng dòng
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y + (index * lineHeight));
        });

    }


    // Gọi hàm resizeCanvas khi trang lần đầu tải
    resizeCanvas();

    canvas.toBlob(async (blob) => {
        if (!blob) {
            console.error("Không thể tạo blob từ canvas");
            return;
        }

        if (downloadImage){
            const objectURL = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = objectURL;
            a.download = "Giỏ hàng.png"
            a.click();
        }
    
        const formData = new FormData();
        formData.append('file', blob); // Thêm blob trực tiếp vào formData
        formData.append('upload_preset', 'storage');
    
        // Gửi yêu cầu POST tới Cloudinary
        try {
            const response = await fetch(`https://api.cloudinary.com/v1_1/di6zxkchd/image/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
    
            // console.log('Hình ảnh đã được tải lên:', data.secure_url);
            const publicId = data.public_id; 

            await sendMessageBot([
                {
                    title: "Giỏ hàng",
                    description: "Dưới đây ảnh của giỏ hàng.",
                    color: 0x3498db, // Màu sắc của embed,
                    image: {
                        url: data.secure_url
                    }
                }
            ]);

        } catch (error) {
            console.error('Lỗi tải lên:', error);
        }
    }, 'image/png');
    


    
}