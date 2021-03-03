const config = require('./config.json');

const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const port = config["express"]["port"];

const db = require('./json-db/products.json');

const {
    arrayToObjectHeaders,
    checkForBasicHeaders
} = require('./src/tools/headers');

let urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.use(session({
    secret: config["express"]["secret"],
    resave: false,
    saveUninitialized: true

}))
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.use('/public', express.static(path.join(__dirname, 'static')));

app.use(function checkHeaders(req, res, next) {
    let headers = arrayToObjectHeaders(req.rawHeaders);
    let are_headers_ok = checkForBasicHeaders(headers);
    if (!are_headers_ok) {
        res.sendStatus(403);
    } else {
        next();
    }
})

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/products/jordan-1-high-mocha', (req, res) => {
    res.render('jordan-1-high-mocha');
})

app.route('/addtocart')
    .get((req, res) => {
        if (!req.query.id || !req.query.size) {
            res.redirect(404);
        } else {
            if (!req.session.products) req.session.products = {};
            if (!req.session.products[req.query.id]) req.session.products[req.query.id] = {};
            if (!req.session.products[req.query.id][req.query.size]) {
                req.session.products[req.query.id][req.query.size] = 1;
            } else {
                req.session.products[req.query.id][req.query.size]++;
            }
            res.redirect('/checkout');
        }
    })

app.route('/checkout')
    .get((req, res) => {
        // GET CHECKOUT FORM
        if (!req.session.products || Object.keys(req.session.products).length == 0) {
            res.redirect('/');
        } else {
            let products = JSON.parse(JSON.stringify(req.session.products));
            for (const product_id of Object.keys(req.session.products)) {
                let product_name = db["products"]["prods_based_on_id"][product_id];
                Object.defineProperty(products, product_name, Object.getOwnPropertyDescriptor(products, product_id));
                delete products[product_id];
            }
            res.render('checkout', {
                products
            });
        }
    })
    .post(urlencodedParser, (req, res) => {
        // POST CHECKOUT DATA
        // name
        // address
        if (!req.session.products || Object.keys(req.session.products).length == 0) {
            res.redirect('/');
        } else {
            if (!req.body.firstName || !req.body.address) {
                res.redirect('/checkout');
            } else {
                req.session.products = {};
                res.render('successful_checkout', {
                    failed: false
                });
            }
        }
    })

app.get('/cart', (req, res) => {
    if (req.session.products && Object.keys(req.session.products).length > 0) {
        let products = JSON.parse(JSON.stringify(req.session.products));
        for (const product_id of Object.keys(req.session.products)) {
            let product_name = db["products"]["prods_based_on_id"][product_id];
            Object.defineProperty(products, product_name, Object.getOwnPropertyDescriptor(products, product_id));
            delete products[product_id];
        }
        if (req.accepts('html')) {
            res.render('cart_html', {
                products
            });
        } else if (req.accepts('json')) {
            res.send(products);
        }
    } else {
        res.redirect('/');
    }
})

app.use((req, res, next) => {
    res.status(404).render('error')
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})