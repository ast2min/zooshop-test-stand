const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// ==================== НАСТРОЙКА СЕРВЕРА ====================
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';  // ← ВАЖНО!

app.use(cors());
app.use(bodyParser.json());

// ==================== БАЗА ДАННЫХ ====================
let users = [
    { id: 1, name: 'Тестовый Пользователь', email: 'test@shop.ru', password: '123456', phone: '+7 999 111-22-33' }
];

let products = [
    { id: 1, name: "Корм Hill's", price: 1850, desc: "Сухой корм для собак мелких пород" },
    { id: 2, name: "Лоток для кошек", price: 920, desc: "Закрытый лоток с фильтром" },
    { id: 3, name: "Игрушка-пищалка", price: 350, desc: "Мягкая игрушка с пищалкой" }
];

let cart = [];
let nextUserId = 2;
let nextProductId = 4;

// ==================== ЛОГИРОВАНИЕ ====================
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next();
});

// ==================== API - ПОЛЬЗОВАТЕЛИ ====================

app.get('/api/users', (req, res) => {
    console.log('📋 Запрошен список пользователей');
    res.json(users);
});

app.post('/api/register', (req, res) => {
    console.log('📝 Регистрация нового пользователя');
    console.log('📥 Данные:', req.body);
    
    const { name, email, password, phone } = req.body;
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        console.log('❌ Пользователь уже существует');
        return res.status(400).json({ 
            success: false, 
            message: 'Пользователь с таким email уже существует' 
        });
    }
    
    const newUser = { 
        id: nextUserId++, 
        name, 
        email, 
        password, 
        phone: phone || '+7 000 000-00-00' 
    };
    users.push(newUser);
    
    console.log('✅ Пользователь создан:', newUser);
    res.json({ 
        success: true, 
        message: 'Регистрация успешна!', 
        user: newUser 
    });
});

app.post('/api/login', (req, res) => {
    console.log('🔑 Попытка входа');
    console.log('📥 Данные:', req.body);
    
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        console.log('❌ Неверный email или пароль');
        return res.status(401).json({ 
            success: false, 
            message: 'Неверный email или пароль' 
        });
    }
    
    console.log('✅ Вход выполнен:', user.name);
    res.json({ 
        success: true, 
        message: 'Вход выполнен!', 
        user: user 
    });
});

// ==================== API - ТОВАРЫ ====================

app.get('/api/products', (req, res) => {
    console.log('📦 Запрошен список товаров');
    res.json(products);
});

app.post('/api/products', (req, res) => {
    console.log('➕ Создание нового товара');
    console.log('📥 Данные:', req.body);
    
    const { name, price, desc } = req.body;
    
    if (!name || !price) {
        return res.status(400).json({ 
            success: false, 
            message: 'Название и цена обязательны' 
        });
    }
    
    const newProduct = { 
        id: nextProductId++, 
        name, 
        price: Number(price), 
        desc: desc || 'без описания' 
    };
    products.push(newProduct);
    
    console.log('✅ Товар создан:', newProduct);
    res.json({ 
        success: true, 
        message: 'Товар создан!', 
        product: newProduct 
    });
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`🗑 Удаление товара ID: ${id}`);
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ 
            success: false, 
            message: 'Товар не найден' 
        });
    }
    
    const deleted = products.splice(index, 1)[0];
    console.log('✅ Товар удален:', deleted);
    res.json({ 
        success: true, 
        message: 'Товар удален!', 
        product: deleted 
    });
});

// ==================== ЗАПУСК СЕРВЕРА ====================
app.listen(PORT, HOST, () => {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('🐾 СЕРВЕР ЗАПУЩЕН!');
    console.log(`🌐 http://${HOST}:${PORT}`);
    console.log('');
    console.log('📋 Доступные API:');
    console.log(`   GET  /api/users     - все пользователи`);
    console.log(`   POST /api/register  - регистрация`);
    console.log(`   POST /api/login     - вход`);
    console.log(`   GET  /api/products  - все товары`);
    console.log(`   POST /api/products  - создать товар`);
    console.log(`   DELETE /api/products/:id - удалить товар`);
    console.log('═══════════════════════════════════════════');
    console.log('');
});

// Держим сервер активным (пинг каждые 5 минут)
setInterval(() => {
    console.log('🔄 Пинг: сервер активен');
}, 300000);