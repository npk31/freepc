async function getData(url) {
    try {
        const res = await axios.get(url, {
            timeout: 20000
        });
        const data = res.data;

        return data;

    } catch (error) {
        console.error("Đã có lỗi xảy ra: ", error);
    }    
}

async function sendMessageBot(embeds){
    const CurrentTime = new Date();
    let d = CurrentTime.getDate();
    let m = CurrentTime.getMonth() + 1;
    let y = CurrentTime.getFullYear();
    let h = CurrentTime.getHours();
    let mn = CurrentTime.getMinutes();
    let s = CurrentTime.getSeconds();
    const webhookUrl = 'https://discord.com/api/webhooks/1292091376221028433/8aoVAAWvk2n9pdiY-BI32RzKNYaI9CWn6ubjNneTFb3gkLCFhX7jQxyAQ0oeD4Qvr1nQ'
    const time = `${h}h:${mn}m:${s}s | ${d}/${m}/${y}`;
    const request = new XMLHttpRequest();
    request.open('POST', webhookUrl);
    request.setRequestHeader('Content-type', 'application/json');

    embeds.push({
        fields: [
            {
                name: `Thời gian`,
                value: time,
                inline: false
            }
        ]
    })

    const params = {
        // content: ``,
        // description: ``,
        color: 0x800080,
        embeds: embeds
    }
    request.send(JSON.stringify(params));
}


function countingAlgorithm(items) {
    const daily = [];

    items.forEach(item => {
        // Tìm kiếm sản phẩm theo tên daily
        const findDaily = daily.find(products => products.name === item.daily);
        
        if (findDaily) {
            // Tìm sản phẩm theo tên
            const findProduct = findDaily.items.find(product => product.name === item.name);

            if (findProduct) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng
                findProduct.quanity += 1;
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm vào danh sách
                findDaily.items.push({
                    name: item.name,
                    value: item.value,
                    preview: item.preview,
                    img: item.img,
                    quanity: 1
                });
            }

        } else {
            // Nếu chưa có sản phẩm nào thuộc daily, thêm daily mới
            daily.push({
                name: item.daily,
                items: [
                    {
                        name: item.name,
                        value: item.value,
                        preview: item.preview,
                        img: item.img,
                        quanity: 1
                    }
                ]
            });
        }
    });

    return daily; // Trả về kết quả để xem dữ liệu đã xử lý
}


function CartSorted(){
    let totalValue = 0;
    const getCart = JSON.parse(localStorage.getItem("cart"));

    if (!getCart) return;

    const cartSorted = countingAlgorithm(getCart);

    cartSorted.forEach((item) => {
        item.items.forEach((product) => {
            totalValue += product.value;
        });
    })

    return {
        array: cartSorted,
        totalValue
    };
}

function CreateError(){
    document.body.replaceChildren();

    const h2 = document.createElement("h2");
    h2.className = 'error';
    h2.innerHTML = "Đã có lỗi xảy ra. Vui lòng thử lại !"

    document.body.appendChild(h2);
}

function CreateNotification(content){
    const divElement = document.createElement("div");
    divElement.className = 'ntf-content';
    divElement.innerHTML = content;

    document.body.appendChild(divElement);

    return divElement;
}


class Page{
    constructor (execute, data){
        this.execute = execute;
        this.data = data;
    }

    create(){
        document.body.replaceChildren();
        this.execute(this.data);
    }
}


(async () => {
    const data = await getData("https://raw.githubusercontent.com/npk31/freepc/refs/heads/data/data.json");
    // const data = await getData("http://localhost:8000/data")
    if (!data) return CreateError();

    const notification = await getData("https://raw.githubusercontent.com/npk31/freepc/refs/heads/data/notification.json");
    if (!notification) return CreateError();



    const page1 = new Page(createPage1, {items: data});
    const page2 = new Page(createPage2, {ntf: notification, page1: page1.create.bind(page1)});

    page1.data.cart = page2.create.bind(page2);
    page1.create();

})();
