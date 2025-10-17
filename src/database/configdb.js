import mongoose from 'mongoose';

const connect = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || 'example',
    });
    console.log('Database connection successful');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default { connect };