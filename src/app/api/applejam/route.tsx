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
        "raffleCode": process.env.REACT_APP_CODE,
        "cardNo": "0",
        "dateFrom": "02/05/2024 06:00:00",
        "dateTo": data.currentDate
    }
    const res = await axios.post(`${process.env.REACT_APP_URL}/api/inplay/raffle/allEntries?key=${process.env.REACT_APP_API_KEY}`, body , 
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