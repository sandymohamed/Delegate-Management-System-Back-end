const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 8800;

const authRoutes = require('./src/routes/auth.routes');
const usersRoutes = require('./src/routes/users.routes');
const customersRoutes = require('./src/routes/customers.routes');
const invoiceRoutes = require('./src/routes/invoice.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const dailyInventoryRoutes = require('./src/routes/dailyInventory.routes');
const vansRoutes = require('./src/routes/vans.routes');
const expensesRoutes = require('./src/routes/expense.routes');
const productsRoutes = require('./src/routes/products.routes');

// const storesRoutes = require('./src/routes/stores');
// const productsRoutes = require('./src/routes/products');
// const invoicesRoutes = require('./src/routes/invoices');

app.use(express.json());

const corsOptions = {
    origin: "http://localhost:3000", 
    credentials: true,             
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Use routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/customers', customersRoutes);
app.use('/invoices', invoiceRoutes);
app.use('/payments', paymentRoutes);
app.use('/daily-inventory', dailyInventoryRoutes);
app.use('/vans', vansRoutes);
app.use('/expenses', expensesRoutes);
// TODO: enhance this route it is just a copy of users
app.use('/products', productsRoutes);

// app.use('/stores', storesRoutes);
// app.use('/invoices', invoicesRoutes);


app.get('/', (req, res) => res.send('Hello World!'));


app.listen(port, () => console.log(`Example app listening at http://localhost:8800`))