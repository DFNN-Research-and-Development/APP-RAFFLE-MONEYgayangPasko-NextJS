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
        "cardNo": data.cardNo,
        "dateFrom": data.dateFrom,
        "dateTo": data.dateTo,
    }
    const res = await axios.get(`${process.env.REACT_APP_URL_REPORTS}/api/v1/raffle/inplay/entries/date?code=${process.env.REACT_APP_CODE}&key=${process.env.REACT_APP_KEY}` , 
    { 
        params: body
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