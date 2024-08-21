const CryptoJS = require('crypto-js')

export default function aesEncrypt (data: string) {
    const srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    const encrypted = CryptoJS.AES.encrypt(srcs, CryptoJS.enc.Utf8.parse("zuQchCu/d40D4Yio4JVRsC9ZNwlmc9oS"), {
        iv: CryptoJS.enc.Utf8.parse("2FqUa55LvP6reg=="),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        keySize: 256,
        blockSize: 128
    });
    return encrypted.toString();
}