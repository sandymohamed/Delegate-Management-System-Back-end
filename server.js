const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 8800

const usersRoutes = require('./src/routes/users.routes');
// const storesRoutes = require('./src/routes/stores');
// const productsRoutes = require('./src/routes/products');
// const customersRoutes = require('./src/routes/customers');
// const invoicesRoutes = require('./src/routes/invoices');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use('/users', usersRoutes);
// app.use('/stores', storesRoutes);
// app.use('/products', productsRoutes);
// app.use('/customers', customersRoutes);
// app.use('/invoices', invoicesRoutes);

app.get('/', (req, res) => res.send('Hello World!'));


app.listen(port, () => console.log(`Example app listening at http://localhost:8800`))