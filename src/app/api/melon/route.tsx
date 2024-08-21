"use server"
import axios from "axios";
import { NextResponse } from "next/server";
import Encrypt from '@/app/component/Encryption'
import Decrypt from '@/app/component/Decryption'

export async function POST() {
    const res = await axios.get(`${process.env.REACT_APP_DATA}/api/v1/outlets?key=${process.env.REACT_APP_DATA_KEY}&login=admin`, 
    { 
        headers: { 
            'Content-Type': 'application/json'
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