import mongoose from 'mongoose';

mongoose.set('strictQuery', false);
export const connectDB = (url: string) => mongoose.connect(url);
