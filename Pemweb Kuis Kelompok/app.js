const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Konfigurasi session
app.use(session({
    secret: 'rahasia',
    resave: false,
    saveUninitialized: true
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Data Tiket (simulasi database)
let tickets = [];

// Halaman Utama
app.get('/', (req, res) => {
    res.render('index', { message: req.session.message, tickets });
    req.session.message = null; // Reset pesan setelah ditampilkan
});

// Proses Pembelian Tiket
app.post('/checkout', (req, res) => {
    const { nama, jumlah } = req.body;
    const tiket = { id: tickets.length + 1, nama, jumlah };
    tickets.push(tiket); // Menambahkan tiket baru ke array
    req.session.message = 'Tiket telah dibeli!';
    res.redirect('/');
});

// Halaman Checkout
app.get('/checkout/:id', (req, res) => {
    const tiket = tickets.find(t => t.id === parseInt(req.params.id));
    if (!tiket) {
        return res.redirect('/');
    }
    res.render('checkout', { pembelian: tiket });
});

// Halaman Edit Tiket
app.get('/edit/:id', (req, res) => {
    const tiket = tickets.find(t => t.id === parseInt(req.params.id));
    if (!tiket) {
        return res.redirect('/');
    }
    res.render('edit', { tiket });
});

// Proses Update Tiket
app.post('/update/:id', (req, res) => {
    const tiket = tickets.find(t => t.id === parseInt(req.params.id));
    if (tiket) {
        tiket.nama = req.body.nama;
        tiket.jumlah = req.body.jumlah;
        req.session.message = 'Tiket telah diperbarui!';
    }
    res.redirect('/');
});

// Proses Hapus Tiket
app.post('/delete/:id', (req, res) => {
    tickets = tickets.filter(t => t.id !== parseInt(req.params.id));
    req.session.message = 'Tiket telah dihapus!';
    res.redirect('/');
});

// Mulai Server
app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});
