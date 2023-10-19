const registerRouter = require('./adminregister');
const logRouter = require('./adminlogin');
const homeRouter = require('./adminhome');
const userRouter = require('./userRoute');
const productRouter = require('./productRouter');
const caterogyRouter =  require('./caterogyRouter');
const cartRouter = require('./cartRouter')


function route(app){
    // app.use('/category/:categoryID',productRouter),
    app.use('/cart',cartRouter)
    app.use('/category',caterogyRouter),
    app.use('/product',productRouter),
    app.use('/user',userRouter),
    app.use('/login', logRouter),
    app.use('/reg', registerRouter),
    app.use('/', homeRouter)
}

module.exports = route;