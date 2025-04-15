import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config'
import Razorpay from "razorpay"
import crypto from "crypto"

import { connectDB } from './utils/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import bookingRoutes from './routes/booking.js';



const app = express();
const port = process.env.PORT ;

connectDB()

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log(process.env.RAZORPAY_KEY_ID, process.env.RAZORPAY_KEY_SECRET)

app.post('/payments/create-order', async(req, res) => {
  const {
    amount,
    currency,
    receipt,
    notes
  } = req.body;
  const opts = {
    amount: amount * 100,
    currency, receipt, notes
  }

  try {
    const order = await razorpay.orders.create(opts)
    res.json(order)
    console.log(order)
  } catch (err) {
    res.status(500).json({status: "failure", error: 'failed to create order'})
    console.error(err) 
  }
})


app.post('/payments/verify-payment', async(req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;


  const signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');

  if(signature === razorpay_signature) {
    res.json({ status: "success" })
  } else {
    res.status(400).json({ status: "failure" })
  }
})


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);


app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server runningggggg on port ${port}`);
})
