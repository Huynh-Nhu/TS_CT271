const registerRouter = require("./register");
const logRouter = require("./login");
const userRouter = require("./userRoute");
const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");
const cartRouter = require("./cartRouter");
const orderRouter = require("./orderRouter");
const adminRouter = require("./adminRegister");
const connectRouter = require("./connectRouter");

function route(app) {
    app.use("/connect", connectRouter);
    app.use("/order", orderRouter);
    app.use("/cart", cartRouter);
    app.use("/category", categoryRouter);
    app.use("/product", productRouter);
    app.use("/user", userRouter);
    app.use("/admin", adminRouter);
    app.use("/login", logRouter);
    app.use("/reg", registerRouter)
}

module.exports = route;
