var productsList = document.getElementById('productsList');
var modalBody = document.querySelector('.modal-window-dialog-body');
var chatButton = document.getElementById('chatButton');
var chatBlock = document.querySelector('.chat-block');

var urlGetProducts = 'https://neto-api.herokuapp.com/florist-shop';
var urlOrder = 'https://neto-api.herokuapp.com/florist-shop/order';
var urlReview = 'https://neto-api.herokuapp.com/florist-shop/review';
var urlWebSocket = 'wss://neto-api.herokuapp.com/florist-shop/support';

var orderData = {};

var products = [
    {id: 1, name: "Букет тюльпанов", "price": 2300, description: "Описание 1", 'image': 'img/1.jpg', 'type': 'flower'},
    {id: 3, name: "Море роз", "price": 1500, description: "Описание 2", 'image': 'img/2.jpg', 'type': 'flower'},
    {id: 2, name: "Букет роз", "price": 2500, description: "Описание 3", 'image': 'img/3.jpg', 'type': 'flower'},
    {id: 4, name: "Букет нежный", "price": 1200, description: "Очень большой букет, очень длинный текст. Про цветы.", 'image': 'img/4.jpg', 'type': 'flower'},
    {id: 5, name: "Букет мечта", "price": 4200, description: "Описание 4", 'image': 'img/5.jpg', 'type': 'flower'},
    {id: 6, name: "Букет Восторг", "price": 3200, description: "Описание 5", 'image': 'img/6.jpg', 'type': 'flower'},
    {id: 7, name: "Пиалы", "price": 5200, description: "Описание 6", 'image': 'img/7.jpg', 'type': 'flower'},
    {id: 8, name: "Синие розы", "price": 1234, description: "Описание 7", 'image': 'img/image.jpg', 'type': 'flower'},
    {id: 201, name: "Ленточка", "price": 200, description: "Красная лента", 'type': 'additional'},
    {id: 202, name: "Конфеты", "price": 300, description: "Конфеты Raffaelo", 'type': 'additional'},
    {id: 203, name: "Открытка", "price": 100, description: "Красочная открытка", 'type': 'additional'}
];

const webSocketObject = {
    connection: null,
    tryConnect: 0,
    _intervalTimeout: 5000,
    _clientClose: false,
    _reconnect: false,
    connect: () => {
        webSocketObject.connection = new WebSocket(urlWebSocket);
        webSocketObject.connection.addEventListener('open', webSocketObject.onOpen);
        webSocketObject.connection.addEventListener('message', webSocketObject.onMessage);
        webSocketObject.connection.addEventListener('error', webSocketObject.onError);
        webSocketObject.connection.addEventListener('close', webSocketObject.onClose);
        
    },
    reconnect: () => {
        if (!webSocketObject._reconnect) {
            webSocketObject._reconnect = true;
            webSocketObject.tryConnect++;
            console.log('Попытка соединения...' + webSocketObject.tryConnect);
            setTimeout(webSocketObject.connect, webSocketObject._intervalTimeout);
        }
    },
    onOpen: (event) => {
        webSocketObject._reconnect = false;
        webSocketObject.tryConnect = 0;
        webSocketObject._intervalTimeout = 5000;
        console.log('Соединение установлено...');
        /*let params = {
            c: 'connect',
            d: ''
            //u: {id: hash}
        };*/
        //webSocketObject.send(JSON.stringify(params));
    },
    onMessage: (event) => {
        messagesBlock = document.querySelector('.chat-messages');
        if (messagesBlock) {
            messagesBlock.appendChild(createMessage(event.data, 'Менеджер'));
        }
    },
    onError: (event) => {
        //webSocketObject._reconnect = false;
        console.log(event);
        console.log(`Произошла ошибка: ${event.data}`);
        webSocketObject._intervalTimeout = 10000;
        webSocketObject.reconnect();
    },
    onClose: (event) => {
        if (webSocketObject._clientClose) {
            return false;
        }
        //webSocketObject._reconnect = false;
        if (event.wasClean) {
            console.log('Соединение закрыто корректно');
        } else {
            console.log(event.code);
        }
        //webSocketObject.tryConnect++;
        if (webSocketObject.tryConnect > 5) {
            webSocketObject._intervalTimeout = 10000;
        }
        if (webSocketObject.tryConnect > 10) {
            webSocketObject._intervalTimeout = 20000;
        }
        webSocketObject.reconnect();
    },
    send: (data) => {
        if (!webSocketObject.connection) {
            return false;
        }
        webSocketObject.connection.send(data);
        return true;
    },
    close: () => {
        if (webSocketObject.connection) {
            webSocketObject._clientClose = true;
            webSocketObject.connection.close();
        }
    }
}

init();

function createEl(type, className, id) {
    var element = document.createElement(type);
    if (className) {
        element.className = className;
    }
    if (id) {
        element.id = id;
    }
    return element;
}

function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function createProduct(product) {
    //<div class="flower-product" data-id="1">
    //    <div class="flower-product-image">
    //        <img src="img/image.jpg">
    //        <div class="flower-product-descr">
    //            <div class="flower-product-image-name">Вариант 1</div>
    //            <div class="flower-product-image-price">2220 руб.</div>
    //            <div class="button-buy position-right-bottom">Заказать</div>
    //        </div>
    //   </div>
    //</div>
    var block = createEl('div', 'flower-product');
    if (product.hasOwnProperty('id')) {
        block.dataset.id = product.id;
    }
    var flowerImage = createEl('div', 'flower-product-image');
    var img = createEl('img');
    if (product.hasOwnProperty('image')) {
        img.src = product.image;
    } else {
        img.src = 'img/image.jpg';
    }
    flowerImage.appendChild(img);

    var divDescr = createEl('div', 'flower-product-descr');
    var divName = createEl('div', 'flower-product-image-name');
    if (product.hasOwnProperty('name')) {
        divName.innerText = product.name;
    }
    divDescr.appendChild(divName);

    var divPrice = createEl('div', 'flower-product-image-price');
    if (product.hasOwnProperty('price')) {
        divPrice.innerText = product.price + ' руб.';
    }
    divDescr.appendChild(divPrice);

    var button = createEl('button', 'button-buy position-right-bottom');
    button.innerText = 'Заказать';
    button.dataset.action = 'order';
    divDescr.appendChild(button);

    flowerImage.appendChild(divDescr);
    block.appendChild(flowerImage);

    var wrapper = createEl('div', 'flower-product-wrapper three columns');
    wrapper.appendChild(block);
    return wrapper;
}

function drawProducts() {
    var row = createEl('div', 'row');
    var i = 0;
    products.forEach(function(value, index) {
        if (value.type != 'flower') {
            return false;
        }
        var product = createProduct(value);
        row.appendChild(product);
        i++;
        if (i % 4 == 0 || (index+1)>=products.length) {
            productsList.appendChild(row);
            
            row = null;
            row = createEl('div', 'row');
        }
    });
}

function getProductById(id) {
    for (var product of products) {
        console.log(id + ' === ' + product.id);
        if (id === product.id) {
            return product;
        }
    }
    return null;
}

function readInputModal(step) {
    if (!step) {
        step = 1;
    }
    var inputs = modalBody.querySelectorAll('input');
    var temp = [];
    if (step === 2) {
        temp = {};
    }
    Array.from(inputs).forEach( function(value) {
        if ((value.type === 'checkbox' || value.type === 'radio')) {
            if (value.checked) {
                if (step === 1) {
                    temp.push(value.value)
                    //temp[value.name] = value.value;
                } else {
                    orderData[value.name] = value.value;
                }
            }
        } else {
            if (step === 1) {
                temp.push(value.value);
            } else {
                temp[value.name] = value.value;
            }
        }
    });
    if (temp) {
        var indexArray = 'product';
        if (step === 2) {
            indexArray = 'delivery';
        }
        orderData[indexArray] = temp;
    }
    
}

function drawModalStepOne(product_id) {
    clearNode(modalBody);
    var product = getProductById(product_id);

    if (!product) {
        console.log('product ' + product_id + ' not found');
        return false;
    }

    var divRow = createEl('div', 'row');
    var divImage = createEl('div', "six columns modal-image-block");
    var img = createEl('img');
    img.src = product.image;
    divImage.appendChild(img);
    var divDescrPrice = createEl('div', 'six columns modal-descr-block');
    var priceP = createEl('p');
    priceP.innerText = product.price + 'руб.';

    var descrP = createEl('p');
    descrP.innerText = product.description;
    divDescrPrice.appendChild(priceP);
    divDescrPrice.appendChild(descrP);
    divRow.appendChild(divImage);
    divRow.appendChild(divDescrPrice);
    modalBody.appendChild(divRow);
    var hiddenInput = createInput('flower', null, 'productId', 'hidden');
    hiddenInput.value = product_id;
    var divRow2 = createEl('div', 'row');
    divRow2.appendChild(hiddenInput);
    var p = createEl('p');
    p.innerText = 'Дополнительные товары';
    divRow2.appendChild(p);
    products.forEach(function(value, index) {
        if (value.type != 'additional') {
            return false;
        }
        var additional = createCheckbox(value.name, value.id);
        divRow2.appendChild(additional);
    });
    
    modalBody.appendChild(divRow2);

    var divRow3 = createEl('div', 'row bottom-right');
    var buttonNext = createEl('button', 'button-pay');
    buttonNext.innerText = 'Далее';

    buttonNext.addEventListener('click', function(event) {
        orderData = {};
        readInputModal();
        console.log(orderData);
        drawModalStepTwo(product_id);
    });
    
    divRow3.appendChild(buttonNext);
    modalBody.appendChild(divRow3);
}

function drawModalStepTwo(product_id) {
    clearNode(modalBody);
    var inputName = createInput('userName', 'u-full-width', null, 'text');
    modalBody.appendChild(createField('Ваше имя', inputName));
    var inputPhone = createInput('phone', 'u-full-width', null, 'text');
    inputPhone.addEventListener('keydown', onKeydownNumberOnly);
    inputPhone.setAttribute('placeholder', '89999999999');
    modalBody.appendChild(createField('Телефон', inputPhone));
    var inputDate = createInput('date', 'u-full-width', null, 'text');
    modalBody.appendChild(createField('Дата', inputDate));
    var inputAddress = createInput('address', 'u-full-width', null, 'text');
    modalBody.appendChild(createField('Адрес', inputAddress));
    var buttonPay = createEl('button', 'button-pay');
    buttonPay.innerText = 'Оформить заказ';
    buttonPay.addEventListener('click', function(event) {
        readInputModal(2);
        console.log(orderData);
        //sendData();
    });

    var divRow3 = createEl('div', 'row bottom-right');
    divRow3.appendChild(buttonPay);
    modalBody.appendChild(divRow3);
}

function resize(event) {
    var body = document.querySelector('body');
    var bodyHeight = body.offsetHeight;
    var allHeight = 0;
    var header = document.querySelector('.header');
    if (header) {
        allHeight += header.offsetHeight;
    }
    var contentBlock = document.querySelector('.products-block');
    if (contentBlock) {
        allHeight += contentBlock.offsetHeight;
    }
    var footer = document.querySelector('.footer');
    if (footer) {
        allHeight += footer.offsetHeight;
    }
    
    if (bodyHeight > allHeight) {
        contentBlock.style = 'margin-bottom: ' + (bodyHeight-allHeight) + 'px';
    }
}
function onKeydownNumberOnly(e) {
    if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
        (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) ||
        (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
}

function createCheckbox(labelText, name) {
    
    var label = createEl('label');
    var input = createInput(name, null, null, 'checkbox');
    input.value = name;
    label.appendChild(input);
    var span = createEl('span', 'label-body');
    span.innerText = labelText;
    label.appendChild(span);
    return label;
}

function createInput(name, className, id, inputType) {
    var input = createEl('input', className, id);
    if (inputType) {
        input.setAttribute('type', inputType);
    }
    if (name) {
        input.setAttribute('name', name);
    }
    return input;
}

function createField(labelText, node) {
    var fragment = document.createDocumentFragment();
    var label = createEl('label');
    label.innerText = labelText;
    fragment.appendChild(label);
    fragment.appendChild(node);
    return fragment;
}

function createMessage(message, nameUser) {
    var messageBlock = createEl('div', 'message-block')
    var span = createEl('span', 'name-user');
    span.innerText = nameUser;
    messageBlock.appendChild(span);
    var text = document.createTextNode(message);
    messageBlock.appendChild(text);
    return messageBlock;
}

function createChat() {
    //<div class="chat-messages"></div>
    //<div class="chat-message-input">
        //<input name="new-message">
    //</div>
    //var fragment = document.createDocumentFragment();
    var wrapper = createEl('div', 'chat-wrapper');
    var divMessages = createEl('div', 'chat-messages');
    var divMessageInput = createEl('div', 'chat-message-input');
    var inputNewMessage = createInput('newMessage', 'u-full-width', null, 'text');
    inputNewMessage.addEventListener('keydown', function (event){
        if (event.keyCode === 13) {
            
            messagesBlock = document.querySelector('.chat-messages');
            if (messagesBlock) {
                messagesBlock.appendChild(createMessage(inputNewMessage.value, 'Вы'));
                webSocketObject.send(inputNewMessage.value);
            }
            event.target.value = '';
        }
    });
    //fragment.appendChild(divMessages);
    wrapper.appendChild(divMessages);
    divMessageInput.appendChild(inputNewMessage);
    //fragment.appendChild(divMessageInput);
    wrapper.appendChild(divMessageInput);
    //return fragment;
    return wrapper;
}

function clickForBuy(event) {
    if (event.target.dataset.action === 'order') {
        event.preventDefault();
        var parent = getParentByClassName(event.target, 'flower-product');
        console.log(parent.dataset.id);
        drawModalStepOne(parseInt(parent.dataset.id));
        toggleModal();
    }
}

function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}

function toggleModal() {
    var modalWrapper = document.querySelector('.modal-wrapper');
    if (!modalWrapper) {
        return false;
    }
    if (isHidden(modalWrapper)) {
        modalWrapper.style = "display: block;";
    } else {
        modalWrapper.style = '';
    }
}

function getParentByClassName(node, className) {
    var curNode = node;
    while(curNode.parentNode) {
        var parentNode = curNode.parentNode;
        if (parentNode.classList.contains(className)) {
            return parentNode;
        }
        curNode = parentNode;
    }
}

function sendData(url, data) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      console.log(xhr.response);
      readInstruction(xhr.response);
    });
    let method = "POST";
    if (!data) {
      method = "GET";
    }
    xhr.open(method, url);
    xhr.send(data);
}
function readInstruction(data) {
    let object = getJsonData(data);
    if (object.hasOwnProperty('product')) {
        products = object.product;
        drawProducts();
    }
}

function getJsonData(data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
}

function init() {
    clearNode(productsList);
    document.addEventListener('DOMContentLoaded', resize);
    //sendData(urlGetProducts);
    drawProducts();
	window.addEventListener('resize', resize);
    productsList.addEventListener('click', clickForBuy);
    document.body.addEventListener('click', function (event) {
        if (
            event.target.classList.contains('modal-wrapper') ||
            event.target.classList.contains('modal-window-dialog-close')
        ) {
            event.preventDefault();
            toggleModal();
        }
    });
    chatButton.addEventListener('click', function (event) {
        
        if (chatBlock) {
            if (isHidden(chatBlock)) {
                chatBlock.classList.add('show');
            } else {
                chatBlock.classList.remove('show');
            }
        }
    });
    chatBlock.appendChild(createChat());
    webSocketObject.connect();
}