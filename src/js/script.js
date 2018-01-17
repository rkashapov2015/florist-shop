var productsList = document.getElementById('productsList');
var modalBody = document.querySelector('.modal-window-dialog-body');

var products = [
    {id: 1, name: "Вариант 1", "price": 2300, description: "dddddd", 'image': 'img/1.jpg'},
    {id: 3, name: "Вариант 3", "price": 1500, description: "dddddd", 'image': 'img/2.jpg'},
    {id: 2, name: "Вариант 2", "price": 2500, description: "dddddd", 'image': 'img/3.jpg'},
    {id: 4, name: "Длинное название", "price": 1200, description: "Очень большой букет, очень длинный текст. Про цветы.", 'image': 'img/4.jpg'},
    {id: 5, name: "Очень длинное название", "price": 4200, description: "dddddd", 'image': 'img/5.jpg'},
    {id: 6, name: "Вариант 6", "price": 3200, description: "dddddd", 'image': 'img/6.jpg'},
    {id: 7, name: "Вариант 7", "price": 5200, description: "dddddd", 'image': 'img/7.jpg'},
    {id: 8, name: "Вариант 8", "price": 1234, description: "dddddd", 'image': 'img/1.jpg'}
];

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

    var divRow2 = createEl('div', 'row');
    
    modalBody.appendChild(divRow2);

    var divRow3 = createEl('div', 'row text-right');
    var buttonNext = createEl('button', 'button-pay');
    buttonNext.innerText = 'Далее';
    divRow3.appendChild(buttonNext);
    
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
    //console.log(bodyHeight, allHeight);
    if (bodyHeight > allHeight) {
        contentBlock.style = 'margin-bottom: ' + (bodyHeight-allHeight) + 'px';
    }
    
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


function init() {
    clearNode(productsList);
    drawProducts();
    document.addEventListener('DOMContentLoaded', resize);
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
}