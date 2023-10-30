const registerRouter = require("./register");
const logRouter = require("./login");
const homeRouter = require("./adminhome");
const userRouter = require("./userRoute");
const productRouter = require("./productRouter");
const caterogyRouter = require("./caterogyRouter");
const cartRouter = require("./cartRouter");
const orderRouter = require("./orderRouter");
const adminRouter = require("./adminRegister");
const connectRouter = require("./connectRouter");

function route(app) {
    app.use("/connect", connectRouter);
    app.use("/order", orderRouter);
    app.use("/cart", cartRouter);
    app.use("/category", caterogyRouter),
    app.use("/product", productRouter),
    app.use("/user", userRouter),
    app.use("/admin", adminRouter);
    app.use("/login", logRouter),
    app.use("/reg", registerRouter),
    app.use("/", homeRouter);
}

module.exports = route;
