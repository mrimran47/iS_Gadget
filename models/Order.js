import mongoose from 'mongoose';
import './address';
import "./product";   
import "./user";  

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, },
    items: [
        {
            product: { type: String, required: true, ref: 'product' },
            quantity: { type: Number, required: true }
        }
    ],
    shippingFee: {
        type: Number,
        required: true, 
        default: 0
    },
    amount: { type: Number, required: true },
    address: { type: String, required: true, ref: 'address' },
    status: { type: String, required: true, default: 'Order Placed' },
    date: { type: Number, required: true }
});

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;