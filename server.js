const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 8800;

const usersRoutes = require('./src/routes/users.routes');
const customersRoutes = require('./src/routes/customers.routes');
const invoiceRoutes = require('./src/routes/invoice.routes');
const paymentRoutes = require('./src/routes/payment.routes');
// const storesRoutes = require('./src/routes/stores');
// const productsRoutes = require('./src/routes/products');
// const invoicesRoutes = require('./src/routes/invoices');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/users', usersRoutes);
app.use('/customers', customersRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/payments', paymentRoutes);

// app.use('/stores', storesRoutes);
// app.use('/products', productsRoutes);
// app.use('/invoices', invoicesRoutes);

app.get('/', (req, res) => res.send('Hello World!'));


app.listen(port, () => console.log(`Example app listening at http://localhost:8800`))