require('dotenv').config({path: '.env'});
const crypto = require('crypto');
const Crypto_algorithm = 'aes-256-cbc';
const Crypto_key = Buffer.from(process.env.PUBLIC_KEY, 'hex');
const Crypto_iv = crypto.randomBytes(16);
const jwt = require('jsonwebtoken');
module.exports = {
    Mongourl:process.env.MONGO_URL,
    ApiPost: parseInt(process.env.APIPORT),
    DashboardPost: parseInt(process.env.DASHBOARDPORT),
    DashboardApiURL: process.env.DASHBOARDAPIURL,
    DashboardAPIPort: process.env.DASHBOARDAPIPORT,
    DASHBOARDAPIPORTHTTP: process.env.DASHBOARDAPIPORTHTTP,
    ImagePublicPath: process.env.PUBLIC_IP+":"+process.env.PORT+"/artwork/",
encrypt:(text)=> {
    let cipher = crypto.createCipheriv(Crypto_algorithm, Buffer.from(Crypto_key), Crypto_iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: Crypto_iv.toString('hex'), encryptedData: encrypted.toString('hex') };
 },
decrypt:(text,crypto_iv)=> {
    let iv = Buffer.from(crypto_iv, 'hex');
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(Crypto_algorithm, Buffer.from(Crypto_key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
 },
 generate_randome_id:()=>{
    return crypto.randomBytes(16).toString('hex');
 },
 generate_Unique_id:()=>{
    return Date.now();
 },
getUniqueId:()=>{
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
},
jwtSign:(data)=>{
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(data, jwtSecretKey);
    return token;
 },
 jwtVerify:(token)=>{
     try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const verified = jwt.verify(token, jwtSecretKey);
        return verified;
    } catch (error) {
        console.log('error verifing JWT',error);
        // Access Denied
        return false;
    }
 }
}