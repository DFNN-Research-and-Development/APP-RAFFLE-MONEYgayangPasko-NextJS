"use server"
import axios from "axios";
import { NextResponse } from "next/server";
import moment from 'moment'
import Encrypt from '@/app/component/Encryption'
import Decrypt from '@/app/component/Decryption'

export async function POST(request: Request) {
    const encryptedData = await request.json()
    const data = JSON.parse(JSON.parse(Decrypt(encryptedData.data)))
    const body = {
        "code": process.env.REACT_APP_CODE,
        "drawPrize": data.prize,
        "cashierAccount": data.username,
        "cashierOutlet": data.username,
        "trigger": "0",
        "drawDate": `${data.dateHR}`,
        "weekNo": data.weekNo
    }
    const res = await axios.patch(`${process.env.REACT_APP_URL_REPORTS}/api/v1/raffle/inplay/picker/${data.entryNo}?key=${process.env.REACT_APP_KEY}`, body , 
    { 
        headers: { 
            'Authorization': `Basic aW5wbGF5OjEyMzQ1Njc4` 
        }
    }).then((response) => {
        return Encrypt(JSON.stringify(response.data))
    }).catch((error) => {
        console.log(error)
        return error
    })
    return NextResponse.json({
        res,
    });
}