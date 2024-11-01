function InsertionSort(arr){
    if (arr.length <= 1) return arr;

    for (let i = 0; i < arr.length; i++){
        let current = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j].value > current.value){
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j+1] = current;
    }

    return arr;
}


function createItem({name, daily, value, img, preview}, parent){
    img = (img.trim() === "") ? "https://i.imgur.com/8w5CddN.png" : img;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    
    const imgItemDiv = document.createElement('div');
    imgItemDiv.className = 'img-item';

    imgItemDiv.onclick = () => {
        location.href = preview;
    }

    const imgItem = document.createElement('img');
    imgItem.src = img;
    imgItem.className = 'img';

    const titleDaily = document.createElement('p');
    titleDaily.className = 'title-daily';
    titleDaily.textContent = daily;

    const nameItem = document.createElement('h3');
    nameItem.className = 'name-item';

    const linkItem = document.createElement('a');
    linkItem.href = preview;
    linkItem.innerHTML = name;

    nameItem.appendChild(linkItem);

    const priceItem = document.createElement('p');
    priceItem.className = 'price-item';
    priceItem.textContent = `${(value <= 100) ? "?" : value.toLocaleString()} đ`;

    const buttonAddCart = document.createElement('button');
    buttonAddCart.className = 'add-cart';
    buttonAddCart.textContent = 'Thêm vào giỏ';

    buttonAddCart.onclick = () => {
        const getCart = JSON.parse(localStorage.getItem("cart"));
    
        const currentTime = new Date();
        const time = {
            d: currentTime.getDate(),
            M: currentTime.getMonth() + 1,
            y: currentTime.getFullYear(),
            h: currentTime.getHours(),
            m: currentTime.getMinutes(),
            s: currentTime.getSeconds()
        }
    
        const product = {
            name,
            value,
            img,
            preview,
            daily,
            time: `${time.s}s:${time.m}m:${time.h}h:${time.d}d:${time.M}M:${time.y}y`,
        };
    
        if (!getCart) {
            localStorage.setItem("cart", JSON.stringify([product]));
            document.querySelector(".sp-crt").textContent = 1;
        } else {
            getCart.push(product); // Đẩy sản phẩm mới vào mảng giỏ hàng
            localStorage.setItem("cart", JSON.stringify(getCart)); // Cập nhật lại localStorage
            document.querySelector(".sp-crt").textContent = getCart.length;
        }

        const cartSorted = CartSorted();

        createImage(cartSorted.array, cartSorted.totalValue);

        const ntf = CreateNotification("✅  Đã thêm thành công !");

        let j = setTimeout(() => {
            document.body.removeChild(ntf);
            clearTimeout(j);
        }, 2500);
        
    }

    imgItemDiv.appendChild(imgItem);
    itemDiv.appendChild(imgItemDiv);
    itemDiv.appendChild(titleDaily);
    itemDiv.appendChild(nameItem);
    itemDiv.appendChild(priceItem);
    itemDiv.appendChild(buttonAddCart);

    parent.appendChild(itemDiv);
}








function createItems(data, parent){
    const itemsDiv = document.createElement('div');
    itemsDiv.className = 'items mx-25';

    const itemsSorted = InsertionSort(data.items);

    itemsSorted.forEach(item => {
        if (!item.value || !item.name || !item.daily) return;
        createItem(item, itemsDiv);
    });

    parent.appendChild(itemsDiv);
}





function createPage1({ items, cart }) {
    const header = document.createElement('header');

    const spanHeader = document.createElement('span');
    spanHeader.textContent = 'Build PC';

    const buttonCart = document.createElement('button');
    buttonCart.id = 'cart';

    const iconCart = document.createElement('i');
    iconCart.className = 'cart-icon';

    const spanCart = document.createElement('span');
    spanCart.className = 'sp-crt';
    spanCart.textContent = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")).length : "0";
    
    buttonCart.onclick = () => {
        cart();
    }

    buttonCart.appendChild(iconCart);
    buttonCart.appendChild(spanCart);


    header.appendChild(spanHeader);
    header.appendChild(buttonCart);

    // Tạo div.container
    const container = document.createElement('div');
    container.className = 'container';

    // Tạo div đầu tiên bên trong container
    const mt25_1 = document.createElement('div');
    mt25_1.className = 'mt-25';

    const tt1_1 = document.createElement('div');
    tt1_1.className = 'tt1';

    const divEmpty1 = document.createElement('div');
    const spanLinhKien = document.createElement('span');
    spanLinhKien.textContent = 'Linh kiện';
    
    tt1_1.appendChild(divEmpty1);
    tt1_1.appendChild(spanLinhKien);
    mt25_1.appendChild(tt1_1);

    const pDuyet = document.createElement('p');
    pDuyet.className = 'tt2';
    pDuyet.textContent = 'Duyệt Theo Danh Mục';
    
    mt25_1.appendChild(pDuyet);

    // Tạo các options
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    const mt25_2 = document.createElement('div');
    mt25_2.className = 'mt-25';

    const components = [
        { src: 'https://i.imgur.com/pIP1sX6.png', text: 'CPU', type: "cpu", select: true },
        { src: 'https://i.imgur.com/r1cU8az.png', text: 'Mainboard', type: "mainboard", select: false },
        { src: 'https://i.imgur.com/aheiR85.png', text: 'RAM', type: "ram", select: false },
        { src: 'https://i.imgur.com/c6nZyxk.png', text: 'SSD', type: "ssd", select: false },
        { src: 'https://i.imgur.com/TqAIoIm.png', text: 'VGA', type: "vga", select: false },
        { src: 'https://i.imgur.com/PNI8h31.png', text: 'Nguồn', type: "psu", select: false },
        { src: 'https://i.imgur.com/WULQPUg.png', text: 'Case', type: "case", select: false },
        { src: 'https://i.imgur.com/RwuNv60.png', text: 'Tản CPU', type: "cpu_fan", select: false },
        { src: 'https://i.imgur.com/RwuNv60.png', text: 'Tản Case', type: "case_fan", select: false },
        { src: 'https://i.imgur.com/l53NRYI.png', text: 'Màn hình', type: "monitor", select: false },
        // { src: 'https://i.imgur.com/3IKKda3.png', text: 'Bàn phím', type: "keyboard", select: false },
        // { src: 'https://i.imgur.com/9ePUuzP.png', text: 'Chuột', type: "mouse", select: false },
        // { src: 'https://i.imgur.com/X3YrjoU.png', text: 'Loa', type: "speaker", select: false },
        // { src: 'https://svgur.com/i/1ANj.svg', text: 'USB', type: "usb", select: false },
    ];

    // Thêm phần tử "Khác"
    const optKhacDiv = document.createElement('div');
    optKhacDiv.className = 'opt';

    const other = {
        type: "other",
        select: false,
        element: optKhacDiv
    }

    components.forEach((component, index) => {
        const optDiv = document.createElement('div');
        optDiv.className = 'opt';

        const imgOpt = document.createElement('img');
        imgOpt.src = component.src;

        const pOpt = document.createElement('p');
        pOpt.textContent = component.text;

        components[index].element = optDiv;

        if (index === 0) {
            optDiv.classList.add("active-sl")
        }

        optDiv.onclick = () => {
            const select = components[index]; // Chọn phần tử hiện tại
            
            if (select.select) return;
            mt25_2.replaceChildren();
            
            const prevSelect = other.select ? other : components.find(item => item.select);
        
            // Nếu có phần tử được chọn trước đó, xóa lớp và đánh dấu lại
            if (prevSelect) {
                prevSelect.element.classList.remove("active-sl"); // Bỏ đánh dấu phần tử trước
                prevSelect.select = false; // Đánh dấu là chưa chọn
            }
        
            // Đánh dấu phần tử hiện tại là đã chọn
            select.select = true;
            optDiv.classList.add("active-sl"); // Thêm lớp cho phần tử hiện tại
        
            // Tạo các mục mới
            createItems(items.find(item => item.type === component.type), mt25_2);
            
        };
        

        optDiv.appendChild(imgOpt);
        optDiv.appendChild(pOpt);
        optionsDiv.appendChild(optDiv);
    });


    const pKhac = document.createElement('p');
    pKhac.className = 'other';
    pKhac.textContent = 'Khác';

    optKhacDiv.onclick = () => {
        mt25_2.replaceChildren();
    
        if (other.select) return;

        const prevSelect = components.find(item => item.select);
    
        // Nếu có phần tử được chọn trước đó, xóa lớp và đánh dấu lại
        if (prevSelect) {
            prevSelect.element.classList.remove("active-sl"); // Bỏ đánh dấu phần tử trước
            prevSelect.select = false; // Đánh dấu là chưa chọn
        }
    
        // Đánh dấu phần tử hiện tại là đã chọn
        other.select = true;
        optKhacDiv.classList.add("active-sl"); // Thêm lớp cho phần tử hiện tại
    
        // Tạo các mục mới
        createItems(items.find(item => item.type === other.type), mt25_2);
    }

    optKhacDiv.appendChild(pKhac);
    optionsDiv.appendChild(optKhacDiv);

    mt25_1.appendChild(optionsDiv);
    container.appendChild(mt25_1);

    // Tạo div thứ hai bên trong container

    const tt1_2 = document.createElement('div');
    tt1_2.className = 'tt1';

    const divEmpty2 = document.createElement('div');
    const spanSanPham = document.createElement('span');
    spanSanPham.textContent = 'Sản phẩm';

    tt1_2.appendChild(divEmpty2);
    tt1_2.appendChild(spanSanPham);
    mt25_2.appendChild(tt1_2);


    createItems(items.find(item => item.type === "cpu"), mt25_2);
    container.appendChild(mt25_2);

    document.body.appendChild(header);
    document.body.appendChild(container);
}
