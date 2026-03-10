import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config";

if( !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)
    throw new Error("Missing Cloudinary configuration");

cloudinary.config({
    cloud_name: 'dxefgwzgz',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    
});

export default cloudinary;

