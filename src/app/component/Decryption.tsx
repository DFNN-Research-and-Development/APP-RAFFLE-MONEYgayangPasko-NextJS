const CryptoJS = require('crypto-js')

export default function aesDecrypt(encryptedData: string | null | false ) {
    if (encryptedData){
        const decrypted =  CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse("zuQchCu/d40D4Yio4JVRsC9ZNwlmc9oS"), {
            iv: CryptoJS.enc.Utf8.parse("2FqUa55LvP6reg=="),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
            keySize: 256,
            blockSize: 128
        })
        return decrypted.toString(CryptoJS.enc.Utf8);
    } else {
        return null
    }
}
