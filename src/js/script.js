var productsList = document.getElementById('productsList');
var modalBody = document.querySelector('.modal-window-dialog-body');
var chatButton = document.getElementById('chatButton');
var chatBlock = document.querySelector('.chat-block');
var sendReview = document.getElementById('sendReview');
var modalWrapper = document.querySelector('.modal-wrapper');

var urlGetProducts = 'https://neto-api.herokuapp.com/florist-shop';
var urlOrder = 'https://neto-api.herokuapp.com/florist-shop/order';
var urlReview = 'https://neto-api.herokuapp.com/florist-shop/review';
var urlWebSocket = 'wss://neto-api.herokuapp.com/florist-shop/support';

var orderData = {};


var array = [];

var products = [
    /*{id: 1, name: "Букет тюльпанов", "price": 2300, description: "Описание 1", 'image': 'img/1.jpg', 'type': 'flower'},
    {id: 3, name: "Море роз", "price": 1500, description: "Описание 2", 'image': 'img/2.jpg', 'type': 'flower'},
    {id: 2, name: "Букет роз", "price": 2500, description: "Описание 3", 'image': 'img/3.jpg', 'type': 'flower'},
    {id: 4, name: "Букет нежный", "price": 1200, description: "Очень большой букет, очень длинный текст. Про цветы.", 'image': 'img/4.jpg', 'type': 'flower'},
    {id: 5, name: "Букет мечта", "price": 4200, description: "Описание 4", 'image': 'img/5.jpg', 'type': 'flower'},
    {id: 6, name: "Букет Восторг", "price": 3200, description: "Описание 5", 'image': 'img/6.jpg', 'type': 'flower'},
    {id: 7, name: "Пиалы", "price": 5200, description: "Описание 6", 'image': 'img/7.jpg', 'type': 'flower'},
    {id: 8, name: "Синие розы", "price": 1234, description: "Описание 7", 'image': 'img/image.jpg', 'type': 'flower'},
    {id: 201, name: "Ленточка", "price": 200, description: "Красная лента", 'type': 'additional'},
    {id: 202, name: "Конфеты", "price": 300, description: "Конфеты Raffaelo", 'type': 'additional'},
    {id: 203, name: "Открытка", "price": 100, description: "Красочная открытка", 'type': 'additional'}*/
];

init();



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
        _reconnect = false;
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
        messagesBlock = document.querySelector('.chat-messages');
        messagesBlock.appendChild(createMessage('Менеджер подключился', ''));
    },
    onMessage: (event) => {
        messagesBlock = document.querySelector('.chat-messages');
        if (messagesBlock) {
            messagesBlock.appendChild(createMessage(event.data, 'Менеджер'));
        }
    },
    onError: (event) => {
        //webSocketObject._reconnect = false;
        
        console.log(`Произошла ошибка: ${event.data}`);
        webSocketObject._intervalTimeout = 10000;
        webSocketObject.reconnect();
    },
    onClose: (event) => {
        if (webSocketObject._clientClose) {
            return false;
        }
        if (event.wasClean) {
            console.log('Соединение закрыто корректно');
            messagesBlock = document.querySelector('.chat-messages');
            messagesBlock.appendChild(createMessage('Менеджер вышел из чата', ''));
        } else {
            console.log(event.code);
        }
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

function el(tagName, attributes, children) {
    const element = document.createElement(tagName);
    if (typeof attributes === 'object') {
        Object.keys(attributes).forEach(i => element.setAttribute(i, attributes[i]));
    }
    if (typeof children === 'string') {
        element.textContent = children;
    } else if (children instanceof Array) {
        children.forEach(child => element.appendChild(child));
    }
    return element;
}

function clearNode(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function createProduct(product) {
    return el('div', {class: 'flower-product-wrapper three columns'},[
        el('div', {class: 'flower-product', "data-id": product.hasOwnProperty('id')?product.id:null},[
            el('div', {class: 'flower-product-image'}, [
                el('img', {src: product.hasOwnProperty('image')?product.image:'img/image.png'}),
                el('div', {class: 'flower-product-descr'}, [
                    el('div', {class: 'flower-product-image-name'}, product.hasOwnProperty('name')?product.name:''),
                    el('div', {class: 'flower-product-image-price'}, product.hasOwnProperty('price')?product.price + ' руб.':''),
                    el('button', {class: 'button-buy position-right-bottom', "data-action":'order'}, 'Заказать')
                ])
            ])
        ] )
    ]);    
}

function drawProducts() {
    var row = el('div', {class:'row'});
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
            row = el('div', {class:'row'});
        }
    });
}

function getProductById(id) {
    for (var product of products) {
        if (id === product.id) {
            return product;
        }
    }
    return null;
}

function readInputModal() {
    data = {};
    
    var frm = new FormData(modalBody.querySelector('form'));
    for (var [k, v] of frm) {
        data = addValueToArray(data, v, k);
    }
    return data;
}

function addValueToArray(array, value, name) {
    if (!array) {
        return false;
    }
    var match = name.match(/([a-z_]+)\[([a-zA-Z]+|)\]/i);
    if (Array.isArray(match) && match[1]) {
        if (!array[match[1]]) {
            if (match[2]) {
                array[match[1]] = {};
            } else {
                array[match[1]] = [];
            }
        }
        if (match[2]) {
            array[match[1]][match[2]] = value;
        } else {
            array[match[1]].push(value);
        }
    } else {
        array[name] = value;
    }
    return array;
}

function validateModalInput() {
    var inputs = modalBody.querySelectorAll('input, textarea');
    var emptyInput = false;
    Array.from(inputs).forEach(function(value, index) {
        if (value.value.length === 0) {
            emptyInput = true;
        }
    });
    if (emptyInput) {
        showModalMessage('Заполните все поля');
        return false;
    }
    return true;
}

function showModalMessage(textMessage) {
    var messageBlock = modalBody.querySelector('.modal-message-block');
    if (!messageBlock) {
        messageBlock = el('div', {class: 'modal-message-block'});
        modalBody.appendChild(messageBlock);
    }
    messageBlock.innerText = textMessage;
}
function hideModalMessage() {
    var messageBlock = modalBody.querySelector('.modal-message-block');
    if (messageBlock) {
        modalBody.removeChild(messageBlock);
    }
}

function drawModalStepOne(product_id) {
    clearNode(modalBody);
    var product = getProductById(product_id);

    if (!product) {
        return false;
    }
    var checkboxes = [];
    for (var value of products) {
        if (value.type != 'additional') {
            continue;
        }
        checkboxes.push(el('label', {}, [
            el('input', {type: 'checkbox', name: 'products[]', value: value.id}),
            el('span', {class: 'label-body'}, value.name)
        ]));
    }
    var buttonNext = el('button', {class:'button-pay'}, 'Далее');
    buttonNext.addEventListener('click', function(event) {
        orderData = {};
        orderData = readInputModal();
        drawModalStepTwo(product_id);
    });
    var offal = [
        el('input', {type: 'hidden', name: 'products[]', id: 'productId', value: product_id}), 
        el('p',{}, 'Дополнительные параметры')
    ];
    offal = offal.concat(checkboxes);
    var stepOne = [
        el('div', {class:'row'}, [
            el('div', {class:'six columns modal-image-block'}, [
                el('img', {src: product.image}),
            ]),
            el('div', {class:'six columns modal-descr-block'}, [
                el('p', {}, product.price + ' руб.'),
                el('p', {}, product.description)
            ])
        ]),
        el('form', {}, [
            el('div', {class: 'row'}, offal)
        ]),
        el('div', {class: 'row bottom-right'}, [buttonNext])
    ];
    var fragment = stepOne.reduce((fragment, current) => {
        fragment.appendChild(current);
        return fragment;
    }, document.createDocumentFragment());
    modalBody.appendChild(fragment);
}



function drawModalStepTwo(product_id) {
    clearNode(modalBody);
    var inputPhone = el('input', {class: 'u-full-width', type: 'text', name: 'delivery[phone]', placeholder: '89999999999'});
    inputPhone.addEventListener('keydown', onKeydownNumberOnly);
    modalBody.appendChild(el('form',{}, [
        el('label', {}, 'Ваше имя'),
        el('input', {class: 'u-full-width', type: 'text', name: 'delivery[name]'}),
        el('label', {}, 'Телефон'),
        inputPhone,
        el('label', {}, 'Дата'),
        el('input', {class: 'u-full-width', type: 'text', name: 'delivery[date]'}),
        el('label', {}, 'Адрес'),
        el('input', {class: 'u-full-width', type: 'text', name: 'delivery[address]'})
    ]));
    var buttonPay = el('button', {class:'button-pay'}, 'Оформить заказ');
    buttonPay.addEventListener('click', function(event) {
        orderData = Object.assign(orderData, readInputModal());
        if (validateModalInput()) {
            hideModalMessage();
            sendData(urlOrder, orderData, orderWork, errorHandler);
            clearNode(modalBody);
            showModalMessage('Подождите...');
        } else {
            console.log('error');
        }
        
    });
    modalBody.appendChild(el('div', {class: 'row bottom-right'},[
        buttonPay
    ]));
}

function drawModalReview() {
    clearNode(modalBody);
    modalBody.appendChild(
        el('form',{}, 
        [
            el('label', {}, 'Ваше имя'),
            el('input', {class: 'u-full-width', type: 'text', name: 'name'}),
            el('label', {}, 'Ваш отзыв'),
            el('textarea', {class: 'u-full-width', name: 'text'})
        ]
    ));
    var buttonSend = el('button', {class:'button-pay'}, 'Отправить отзыв');
    buttonSend.addEventListener('click', function(event) {
        if (!validateModalInput()) {
            showModalMessage('Заполните поля');
        } else {
            var reviewData = readInputModal();
            clearNode(modalBody);
            showModalMessage('Подождите');
            sendData(urlReview, reviewData, reviewWork, errorHandler);
        }
    });
    modalBody.appendChild(el('div', {class: 'row bottom-right'}, [
        buttonSend
    ]));
}

function resize(event) {
    var body = document.querySelector('body');
    var bodyHeight = body.offsetHeight;
    var allHeight = 0;
    var header = document.querySelector('.header');
    if (header) {
        allHeight += header.offsetHeight;
    }
    var contentBlock = document.querySelector('#container');
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
    resizeCanvas();
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

function createMessage(message, nameUser) {
    var text = document.createTextNode(message)
    return el('div', {class: 'message-block'}, [
        el('span', {class: 'name-user'}, nameUser),
        text
    ]);
}

function createChat() {
    var inputNewMessage = el('input', {name:'newMessage', class:'u-full-width', type:'text'});
    inputNewMessage.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            messagesBlock = document.querySelector('.chat-messages');
            if (messagesBlock) {
                messagesBlock.appendChild(createMessage(inputNewMessage.value, 'Вы'));
                webSocketObject.send(inputNewMessage.value);
            }
            event.target.value = '';
        }
    });
    return el('div', {class: 'chat-wrapper'},[
        el('div', {class: 'chat-messages'}),
        el('div', {class: 'chat-message-input'}, [
            inputNewMessage
        ])
    ]);
}

function clickForBuy(event) {
    if (event.target.dataset.action === 'order') {
        event.preventDefault();
        var parent = getParentByClassName(event.target, 'flower-product');
        drawModalStepOne(parseInt(parent.dataset.id));
        toggleModal();
    }
}

function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}

function toggleModal() {
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

function errorHandler(e) {
    console.log(e);
}

function sendData(url, data, func, errorFunc) {
    const xhr = new XMLHttpRequest();
    
    xhr.addEventListener('load', (e) => {
        if (func) {
            func(xhr.response);
        } else {
            console.log(xhr.response);
        }
    });
    xhr.addEventListener('error', function (e) {
        if (errorFunc) {
            errorFunc(e);
        } else {
            console.log("Ошибка " + e.target.status);
        }
    });
    var method = "POST";
    if (!data) {
      method = "GET";
    }
    xhr.open(method, url);
    //xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    if (data) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
}

function readInstruction(data) {
    var object = getJsonData(data);
    if (object.hasOwnProperty('product')) {
        products = object.product;
        drawProducts();
        resize();
    }
    if (object.hasOwnProperty('type')) {
        var success = false;
        if (object.hasOwnProperty('success')) {
            success = object.success;
        }
        switch(object.type) {
            case 'order':
                orderWork(success);
            break;
            case 'review':
                reviewWork(success);
            break;
        }
    }
}

function initData(data) {
    var object = getJsonData(data);
    if (object.hasOwnProperty('product')) {
        products = object.product;
        drawProducts();
        resize();
    }
}

function orderWork(data) {
    var object = getJsonData(data);
    var success = object.success;
    if (isHidden(modalWrapper)) {
        toggleModal();    
    }
    clearNode(modalBody);
    message = 'Произошла ошибка';
    if (success) {
        message = 'Ваш заказ был создан';
    }
    showModalMessage(message);
}
function reviewWork(data) {
    var object = getJsonData(data);
    var success = object.success;
    if (isHidden(modalWrapper)) {
        toggleModal();
    }
    clearNode(modalBody);
    message = 'При отправке отзыва произошла ошибка';
    if (success) {
        message = 'Спасибо за Ваш отзыв!';
    }
    showModalMessage(message);
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
    sendData(urlGetProducts, null, initData, errorHandler);
    
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
                webSocketObject.connect();
                chatBlock.classList.add('show');
            } else {
                chatBlock.classList.remove('show');
            }
        }
    });
    chatBlock.appendChild(createChat());
    sendReview.addEventListener('click', function (event) {
        event.preventDefault();
        drawModalReview();
        toggleModal();
    });
}