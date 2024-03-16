const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
app.use(cors());
app.use(express.json());
require('dotenv').config();
// Internal dependencies
// import { connectDatabase } from "./database.js";
// import authRouter from "./routes/auth.js";
// import profileRouter from "./routes/profile.js";
// import walletRouter from "./routes/wallet.js";
// import checkoutRouter from "./routes/checkout.js";
// import bookingRouter from "./routes/booking.js";
// import hotelRouter from "./routes/hotel.js";
// import roomRouter from "./routes/room.js";
// import reviewRouter from "./routes/reviews.js";
// import searchRouter from "./routes/search.js";



// Routes
// app.use('/', authRouter);
// app.use('/', profileRouter);
// app.use('/', walletRouter);
// app.use('/', checkoutRouter);
// app.use('/', bookingRouter);
// app.use('/', hotelRouter);
// app.use('/', roomRouter);
// app.use('/', reviewRouter);
// app.use('/', searchRouter);

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("🚀 Connected to Database Successfully 🚀");
        })
        .catch(error => {
            console.error("Error connecting to database:", error);
        });
}
// Connect to MongoDB
connectDatabase();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running 🚀 Listening on port ${PORT}`);
});
