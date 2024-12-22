
function createPage2({ntf, page1}) {
    let totalValueProducts = 0;


    function createRowProduct({img, name, value, quanity, totalValue, preview, daily, rowTable, parentTable, table, prevPage}){
        let totalValueProduct = totalValue;
    
        const trProduct = document.createElement('tr');
    
        const productCell = document.createElement('td');
        productCell.className = 'prt1-tb1';
        const productLinkImg = document.createElement('a');
        productLinkImg.href = preview;
        productLinkImg.className = 'img';
        productLinkImg.style.background = `url("${img}") no-repeat`
        productCell.appendChild(productLinkImg);
    
        const productLinkName = document.createElement('a');
        productLinkName.className = 'name';
        productLinkName.href = preview;
        productLinkName.textContent = name;
        productCell.appendChild(productLinkName);
        trProduct.appendChild(productCell);
    
        const priceCell = document.createElement('td');
        priceCell.className = 'value1-tb1';
        priceCell.textContent = (value <= 100) ? "?" : value.toLocaleString() + "đ";
        trProduct.appendChild(priceCell);
    
        const quantityCell = document.createElement('td');
        quantityCell.className = 'qnt1-tb1';
    
        const btnReduce = document.createElement('button');
        btnReduce.id = 'rd-product';
        btnReduce.textContent = '-';
        quantityCell.appendChild(btnReduce);
        
        const inputQuantity = document.createElement('input');
        inputQuantity.id = 'qnt-product';
        inputQuantity.type = 'text';
        inputQuantity.disabled = true;
        inputQuantity.value = quanity;
        quantityCell.appendChild(inputQuantity);
    
        const btnAdd = document.createElement('button');
        btnAdd.id = 'add-product';
        btnAdd.textContent = '+';
        quantityCell.appendChild(btnAdd);
        
        trProduct.appendChild(quantityCell);
    
        const totalCell = document.createElement('td');
        totalCell.className = 'value2-tb1';
        totalCell.innerHTML = totalValue.toLocaleString() + "đ";
        trProduct.appendChild(totalCell);
        
        table.appendChild(trProduct);
    
        btnReduce.onclick = () => {
            if (inputQuantity.value == 1) {  // Sửa placeholder thành value
                table.removeChild(trProduct);
                
                if (rowTable === 1) {
                    parentTable.removeChild(table);
                } else {
                    rowTable--;
                }
            } else {
                totalValueProduct -= value;  // Sửa lại thành phép toán trừ
                inputQuantity.value--;  // Giảm số lượng sản phẩm
                totalCell.innerHTML = `${totalValueProduct.toLocaleString()}đ`;
            }
        
            let getCart = JSON.parse(localStorage.getItem("cart"));
            let productIndex = getCart.findIndex(item => item.name === name && item.daily === daily);
        
            if (productIndex !== -1) {
                getCart.splice(productIndex, 1);
            }
        
            localStorage.setItem("cart", JSON.stringify(getCart));
        
            totalValueProducts -= value;
            document.querySelector(".total-value-cart").innerHTML = `${totalValueProducts.toLocaleString()}đ`;
        
            getCart = JSON.parse(localStorage.getItem("cart"));
        
            if (getCart.length == 0) {
                createNotFound(document.querySelector(".container"), prevPage);
            }

            const cartSorted = CartSorted();
            createImage(cartSorted.array, cartSorted.totalValue);
        }
        
        btnAdd.onclick = () => {
            inputQuantity.value++;  // Tăng số lượng sản phẩm
            totalValueProduct += value;  // Cộng giá trị sản phẩm
            totalValueProducts += value;

            totalCell.innerHTML = `${totalValueProduct.toLocaleString()}đ`;
        
            const getCart = JSON.parse(localStorage.getItem("cart"));
            getCart.push({
                name,
                value,
                preview,
                img,
                daily
            });
        
            localStorage.setItem("cart", JSON.stringify(getCart));
        
            document.querySelector(".total-value-cart").innerHTML = `${totalValueProducts.toLocaleString()}đ`;

            const cartSorted = CartSorted();
            createImage(cartSorted.array, cartSorted.totalValue);
        }
    
    }






    function createTableDaily(products, nameDaily, parent, prevPage){
        const table = document.createElement('table');
        table.className = 'tb1-cart';
        
        const trTitle = document.createElement('tr');
        trTitle.className = 'title-tb1';
        const headers = [nameDaily, 'Đơn Giá', 'Số Lượng', 'Thành Tiền'];
    
        headers.forEach((headerText, index) => {
            const th = document.createElement('th');
            th.className = `col-${index + 1} sm-pd-b-15`;
            th.textContent = headerText;
            trTitle.appendChild(th);
        });
    
        table.appendChild(trTitle);
        parent.appendChild(table);
    
    
        products.forEach(item => {
            const { name, value, preview, img, quanity } = item;
            const totalValue = quanity * value;
    
            totalValueProducts += totalValue;
    
            createRowProduct({ img, name, value, quanity, totalValue, preview, daily: nameDaily, rowTable: products.length, table, parentTable: parent, prevPage });
        });

    }












    function createNotFound(parent, prevPage = () => {}){
        parent.replaceChildren();
        
        const center = document.createElement("div");
        center.classList.add("absolute-center");
        parent.appendChild(center);
    
        const tt4 = document.createElement("p");
        tt4.className = "tt4";
        tt4.style.width = "500px";
        tt4.style.textAlign = "center";
        tt4.innerHTML = "<mark>Giỏ hàng chưa có sản phẩm nào </mark>";
    
        center.appendChild(tt4);
    
        const comebackBtn = document.createElement("button");
        comebackBtn.className = "btn-back-cart";
        comebackBtn.innerHTML = "Quay Lại"
    
        comebackBtn.onclick = ()=>{
            prevPage()
        }
    
        center.appendChild(comebackBtn);
    }























    document.body.classList.add("bg-color-2");

    // Tạo header
    const header = document.createElement('header');
    header.style.background = "transparent"

    const spanBuildPC = document.createElement('span');
    spanBuildPC.textContent = 'Build PC';
    spanBuildPC.onclick = () => {
        page1();
    }

    header.appendChild(spanBuildPC);

    const cartButton = document.createElement('button');
    cartButton.id = 'cart';
    const closeCartIcon = document.createElement('i');
    closeCartIcon.className = 'close-cart-icon';
    cartButton.appendChild(closeCartIcon);

    closeCartIcon.onclick = () => {
        page1();
    }


    header.appendChild(cartButton);
    document.body.appendChild(header);
    
    // Tạo container
    const container = document.createElement('div');
    container.className = 'container';

    document.body.appendChild(container);
    
    const getCart = JSON.parse(localStorage.getItem("cart"));
    if (!getCart || getCart.length == 0) return createNotFound(container, page1);

    // Tạo mt-25 div
    const mt25Div = document.createElement('div');
    mt25Div.className = 'mt-25';

    // Tạo tt1 div
    const tt1Div = document.createElement('div');
    tt1Div.className = 'tt1';
    tt1Div.appendChild(document.createElement('div'));
    const cartSpanTitle = document.createElement('span');
    cartSpanTitle.textContent = 'Giỏ Hàng';
    tt1Div.appendChild(cartSpanTitle);
    mt25Div.appendChild(tt1Div);

    // Tạo d-flex div
    const dFlexDiv = document.createElement('div');
    dFlexDiv.className = 'd-flex child-mt-25';

    const pSelectedProduct = document.createElement('p');
    pSelectedProduct.className = 'tt4';
    pSelectedProduct.textContent = 'Sản Phẩm Đã Lựa Chọn';
    dFlexDiv.appendChild(pSelectedProduct);

    const spanRemoveAll = document.createElement('span');
    spanRemoveAll.className = 'rm-all alg-s-center';
    spanRemoveAll.id = 'rm-all';
    spanRemoveAll.textContent = 'Xóa tất cả';

    spanRemoveAll.onclick = () => {
        localStorage.setItem("cart", JSON.stringify([]));

        location.reload([]);
    }

    dFlexDiv.appendChild(spanRemoveAll);

    const downloadButton = document.createElement('button');
    downloadButton.className = 'alg-s-center';
    downloadButton.id = 'download-img-cart';
    downloadButton.textContent = 'Tải hình ảnh';


    dFlexDiv.appendChild(downloadButton);

    mt25Div.appendChild(dFlexDiv);
    container.appendChild(mt25Div);

    // Tạo phần sản phẩm và bảng
    const productDiv = document.createElement('div');
    productDiv.className = 'mt-25 md-flex-col mb-25';

    const productsPart = document.createElement('div');
    productsPart.className = 'md-flex-row md-w-65 products-part';

    const cartSorted = CartSorted();

    cartSorted.array.forEach(item => {
        createTableDaily(item.items, item.name, productsPart, page1);
    });

    productDiv.appendChild(productsPart);

    // Tạo phần thông báo và tổng tiền
    const ntfTotalDiv = document.createElement('div');
    ntfTotalDiv.className = 'md-flex-row md-w-30 ntf-total_val';

    const ntfDiv = document.createElement('div');
    ntfDiv.className = 'ntf mx-25 w-full md-ml-25';
    const pNotice = document.createElement('p');
    pNotice.className = 'tt3';
    pNotice.textContent = 'Lưu ý';
    ntfDiv.appendChild(pNotice);

    const ulNotice = document.createElement('ul');
    ulNotice.className = 'l-cnt-ntf';


    downloadButton.onclick = () => {
        createImage(cartSorted.array, totalValueProducts, true);
    }


    ntf.forEach(notice => {
        const li = document.createElement('li');
        li.textContent = notice;
        ulNotice.appendChild(li);
    });

    ntfDiv.appendChild(ulNotice);
    ntfTotalDiv.appendChild(ntfDiv);

    const totalValueDiv = document.createElement('div');
    totalValueDiv.className = 'total-value-cart mx-25 w-full md-ml-25';
    totalValueDiv.innerHTML = totalValueProducts.toLocaleString() + "đ";
    ntfTotalDiv.appendChild(totalValueDiv);

    productDiv.appendChild(ntfTotalDiv);
    container.appendChild(productDiv);

}
