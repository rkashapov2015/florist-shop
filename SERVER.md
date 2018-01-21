# Функционал сервера

## WebSocket
Вебсокет для чата. При подключении нужно приветствие 'Здравствуйте, чем могу Вам помочь?' и через 30 секунд соединение теряется.

## XMLHttpRequest
### Получение данных
запрос:
урл: `/get-data`
метод: **GET**
*ответ:*
    формат: **JSON**
    тело:  `{
        "product": [
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
        ]
    }`
### Создание заказа
*Отправка заказа на сервер*
урл: `/create-order`
тело: `{
        delivery: {name: xxxx, phone: xxxxxxxx, date: xxxxxx, address: xxxxxx },
        products: [id,id,id,id]
    }
    `
метод: **POST**
*ответ:* `{type: 'order', success: true/false}`
### Отправка отзыва
урл: `/send-review`
метод: **POST**
тело: `{
    name: 'Jonh Doe',
    text: '...'
}`
*ответ:* `{type: 'review', success: true/false}`