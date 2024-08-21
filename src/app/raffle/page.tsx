"use client"
import React, { useEffect, useState } from 'react'
import Topbar from "../component/Topbar"
import Decrypt from "@/app/component/Decryption"
import Encrypt from "@/app/component/Encryption"
// import AnimatedNumbers from "react-animated-numbers";
import axios from "axios"
import Swal from 'sweetalert2'
import { Typography, Box, Grid, Button, Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent } from '@mui/material'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import dynamic from "next/dynamic";
import useSound from 'use-sound';

const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
})


// IMAGES
const raffleTitle = './images/components/title logo-shine.png'
const InstawinLogo = './images/components/Instawin.png'
const CongratsGIF = './images/components/congrats.gif'
const cheerSound = "./sounds/cheerfx.mp3"
const drumrollSound = "./sounds/drumrolls.mp3"
const MaskData = require('maskdata')

const Raffle : React.FC = () => {
    const router = useRouter()
    const [username, setUsername]= useState<any>()
    const [prizes, setPrizes] = useState<any>()
    const [category, setCategory] = useState<any>()
    const [drawDate, setDrawDate] = useState<any>()
    const [winnersRow, setWinnerRow]  = useState([] as any)
    const [winnersRowRaw, setWinnerRowRaw]  = useState([] as any)
    const [loading, setLoading] = useState<boolean>(false)
    const [countWinner, setCountWinner] = useState(0)
    const [overallEntries, setOverallEntries] = useState(0)
    const [disable, setDisable] = useState(false)
    const [winnerusername, setWinnerUsername] = useState('')
    const [winnerDialog, setWinnerDialog] = useState(false)
    const [prize, setPrize] = useState('')
    const currentDate = moment().format('l 06:00:00 ')
    const [entryNumbers, setEntryNumbers] = useState([0,0,0,0,0,0])
    const [cardNumber, setCardNumber] = useState('')
    const [fullName, setFullname] = useState('')
    const [entryNumber, setEntryNumber] = useState('')
    const [outlet, setOutlet] = useState('')
    const [raffleLoading, setRaffleLoading] = useState<boolean>(false)
    const [playCheerSound] = useSound(cheerSound)
    const [playDrumrollSound] = useSound(drumrollSound)

    function safeParseSessionStorageItem(key: string) {
        const encryptedData = sessionStorage.getItem(key);
    
        if (encryptedData) {
            try {
                const decryptedData = Decrypt(encryptedData);
                const parsedData = JSON.parse(decryptedData);
                return JSON.parse(parsedData);
            } catch (error) {
                console.error('Error parsing sessionStorage item:', error);
                return null;
            }
        }
    
        return null;
    }

    const handleReload = () => {
        router.push('/raffle')
    }

    const verifySession = () => {
        fetchEntries()
        if (typeof window !== 'undefined'){
            const sessionData: any = safeParseSessionStorageItem("data")
            setUsername("IWRT1T")
            setPrizes(sessionData?.prizes)
            setCategory(sessionData?.category)
            setDrawDate(sessionData?.date)
            fetchWinnersData(sessionData?.username,sessionData?.category,sessionData?.date)
        }
    }

    const maskNameConfig = {
        maskWith: "*",
        maxMaskedCharacters: 256,
        unmaskedStartCharacters: 2,
        unmaskedEndCharacters: 2
      }
  
    const maskCardConfig = {
        maskWith: "*",
        unmaskedStartDigits: 4,
        unmaskedEndDigits: 2
    }

    const fetchEntries = async () => {
        setRaffleLoading(true)
        const body = Encrypt(JSON.stringify({
            currentDate: currentDate,
        }))

        try{
            axios.post('/api/applejam', {
                data: body
            }).then((res) => {
                try{
                    setRaffleLoading(false)
                    const response = JSON.parse(JSON.parse(Decrypt(res.data.res)))
                    setOverallEntries(response.results.length)
                } catch(err){
                    setRaffleLoading(false)
                    console.log(err)
                    Swal.fire({
                        title: 'Fetching OverAll Entries Failed',
                        text: 'Please try again later',
                        icon: 'error',
                        heightAuto: false
                    })
                }
            }).catch((err) => {
                setRaffleLoading(false)
                console.log(err)
                Swal.fire({
                    title: 'Fetching OverAll Entries Failed',
                    text: 'Please try again later',
                    icon: 'error',
                    heightAuto: false
                })
            })
        }
        catch (err) {
            setRaffleLoading(false)
            Swal.fire({
                title: 'Fetching OverAll Entries Failed',
                text: 'Please try again later',
                icon: 'error',
                heightAuto: false
            })
            console.log(err)
        }
    }

    const fetchWinnersData = async (user: any, ctg: any, date: any) => {
        setLoading(true)
        const body = Encrypt(JSON.stringify({
            user: "IWRT1T",
            category: ctg,
            date: moment(date).format("MM/DD/YYYY")
        }))
        try{
            axios.post('/api/strawberry', {
                data: body
            }).then((res) => {
                try {
                    const response = JSON.parse(JSON.parse(Decrypt(res.data.res)))
                    const arr = response.results.map((res: any, index: number) => {
                        return ({
                            id: index, 
                            No: index+1,
                            FullName: res.FullName, 
                            EntryNo: res.EntryNo, 
                            CardNo: res.CardNo,
                            OutletName: res.OutletName,
                            ExtRefId: res.ExtRefId,
                            DrawPrize: res.DrawPrize, 
                            DrawDate: moment(res.DrawDate).format('YYYY-MM-DD hh:mm:ss')
                        })
                    })
                    const arr2 = response.results.map((res: any, index: number) => {
                        return ({
                            No: index+1,
                            FullName: res.FullName, 
                            EntryNo: res.EntryNo, 
                            CardNo: res.CardNo,
                            OutletName: res.OutletName,
                            ExtRefId: res.ExtRefId,
                            DrawPrize: res.DrawPrize, 
                            DrawDate: moment(res.DrawDate).format('YYYY-MM-DD hh:mm:ss')
                        })
                    })
                    setLoading(false)
                    setWinnerRow(arr)
                    setWinnerRowRaw(arr2)
                    setCountWinner(response.results.length)
                } catch(err){
                    console.log(err)
                    Swal.fire({
                        title: "Oops..",
                        text: "There's an error with fetching winners data",
                        icon: "error",
                        heightAuto: false
                    }).then(() => {
                        handleReload()
                    })
                    
                }
            }).catch((err) => {
                setLoading(false)
                Swal.fire({
                    title: "Oops..",
                    text: "There's an error with fetching winners data",
                    icon: "error",
                    heightAuto: false
                }).then(() => {
                    handleReload()
                })
                console.log(err)
            })
        }
        catch (err) {
            setLoading(false)
            Swal.fire({
                title: "Oops..",
                text: "There's an error with fetching winners data",
                icon: "error",
                heightAuto: false
            }).then(() => {
                handleReload()
            })
            console.log(err)
        }
    }
    
    const getAWinner = async ()=> {
        setLoading(true)
        setDisable(true)
        const time = moment().format("HH:mm:ss")
        const user = "IWRT1T"
        if(countWinner === prizes.length) {
            setLoading(false)
          Swal.fire({
              title: 'Raffle Completed!',
              text: 'Congratulations to all winners.',
              icon: 'success',
              heightAuto: false
            }).then(() => {
                setDisable(false)
            })
        } else {
            const body = Encrypt(JSON.stringify({
                    category: category,
                    username: user,
                    date : `${moment(drawDate).format("YYYY/MM/DD")} ${time}`
            }))
            try{
                axios.post('/api/mangograham', {
                    data: body
                }).then((res) => {
                   try {
                        setLoading(false)
                        const response = JSON.parse(JSON.parse(Decrypt(res.data.res)))
                        const arrNum = response.results[0].EntryNo.toString().split("")
                        const raffleNum = arrNum.map(Number)
                        setEntryNumbers(raffleNum)
                        if (response.results.length > 0){
                            let indexPrize = countWinner === null ? 0 : countWinner
                            setEntryNumber(response.results[0].EntryNo)
                            setFullname(response.results[0].FullName)
                            setCardNumber(MaskData.maskCard(response.results[0].CardNo, maskCardConfig))
                            setOutlet(response.results[0].OutletName)
                            setPrize(prizes[indexPrize])
                            const entrybody = Encrypt(JSON.stringify({
                                prize: prizes[indexPrize],
                                username: user,
                                dateHR: `${moment(drawDate).format("YYYY/MM/DD")} ${time}`,
                                entryNo: response.results[0].EntryNo,
                                weekNo: category
                            }))
                            try {
                                axios.post('/api/blueberry', {
                                    data: entrybody
                                }).then((res2) => {
                                    const response2 = JSON.parse(JSON.parse(Decrypt(res2.data.res)))
                                    if(response2.data.inplayRaffleResult === "1"){
                                        playDrumrollSound()
                                        setTimeout(() => {
                                            playCheerSound()
                                            setWinnerDialog(true)
                                            setDisable(false)
                                            fetchWinnersData(username, category, drawDate)
                                        }, 7000)
                                    } else {
                                        Swal.fire({
                                            title: "Oops...",
                                            text: "There's a problem with the picker, please try again later",
                                            icon: 'error',
                                            heightAuto: false
                                        }).then(() => {
                                            setDisable(false)
                                            setLoading(false)
                                            setEntryNumbers([0,0,0,0,0,0])
                                        })
                                    }
                                }).catch(err => console.log(err))
                            } 
                            catch (err){err}
                        } else {
                            Swal.fire({
                                title: "Oops...",
                                text: "There's a problem with the picker, please try again later",
                                icon: 'error',
                                heightAuto: false
                            }).then(() => {
                                setDisable(false)
                                setLoading(false)
                                setEntryNumbers([0,0,0,0,0,0])
                            })
                        }
                   } catch(err){
                    console.log(err)
                        Swal.fire({
                            title: "Oops...",
                            text: "There's a problem with the picker, please try again later",
                            icon: 'error',
                            heightAuto: false
                        }).then(() => {
                            setDisable(false)
                            setLoading(false)
                            setEntryNumbers([0,0,0,0,0,0])
                        })
                   }
                }).catch(err => {
                    console.log(err)
                    Swal.fire({
                        title: "Oops...",
                        text: "There's a problem with the picker, please try again later",
                        icon: 'error',
                        heightAuto: false
                    }).then(() => {
                        setDisable(false)
                        setLoading(false)
                        setEntryNumbers([0,0,0,0,0,0])
                    })
                })
            }
            catch (err){
                console.log(err)
                Swal.fire({
                    title: "Oops...",
                    text: "There's a problem with the picker, please try again later",
                    icon: 'error',
                    heightAuto: false
                }).then(() => {
                    setDisable(false)
                    setLoading(false)
                    setEntryNumbers([0,0,0,0,0,0])
                })
            }
        }
    }

    useEffect(() => {
        verifySession()
    }, [])
    

    return(
        <div className="raffle-bg">
            <Topbar disable={false} arr={winnersRow} arr2={winnersRowRaw} countWinner={countWinner} path="/raffle" overallEntries={overallEntries}/>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <Typography sx={{ pr: 2 }}> Loading...  </Typography>
                <CircularProgress color="inherit" />
            </Backdrop>


            <Box sx={{ width: "100%", marginTop: 15}}>
            <Box sx={{ borderRadius: 1, width: "400px", margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={raffleTitle} width="400px" alt="Raffle Title" />
            </Box>

            <Grid 
                className="raffle-numbers-bg" 
                container 
                sx={{ 
                    margin: "auto", 
                    width: '900px', 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    mt: -30, 
                    mr: "28%",
                    pl: 15,
                    pt: 19,
                }}
                > 
                {
                    entryNumbers.map((number, index) => {
                        return(
                            <Grid item key={index} sx={{ p: 2 }}>
                                <AnimatedNumbers
                                    animateToNumber={number}
                                    fontStyle={{
                                        fontSize: 100,
                                        color: "#FFD874",
                                        fontWeight: 600, 
                                        WebkitTextStrokeColor: "black", 
                                        WebkitTextStrokeWidth: "2px"
                                    }}
                                    transitions={(index) => ({
                                        type: "spring",
                                        duration: index + 6,
                                      })}
                                />
                            </Grid>
                        )
                    })
                }
            </Grid>

            <Box sx={{ margin: 'auto', width: 134, mt: -15 }}>
                {
                    raffleLoading ? <Button sx={{ width: 200, fontSize: 22, border: '#FFD8A6 solid 2px', bgcolor: "#13654C", color: "#FEC10E", WebkitTextStrokeColor: "black", WebkitTextStrokeWidth: "2px" }} disabled={true} variant='contained'> Updating.. </Button> :
                    <Button sx={{ fontWeight: 800, width: 200, fontSize: 22, border: '#FFD8A6 solid 2px', bgcolor: '#13654C', color: "#FEC10E", WebkitTextStrokeColor: "black", WebkitTextStrokeWidth: "2px" }} disabled={disable} variant='contained' onClick={getAWinner}> { loading === true ? <CircularProgress color='info' /> : "Draw" }</Button>
                }
            </Box>
        </Box>

        <Dialog 
            open={winnerDialog} 
            fullWidth 
            maxWidth={'md'} 
            onClose={() => {
                setWinnerDialog(false)
                setEntryNumbers([0,0,0,0,0,0])
            }}
            sx={{
                '& .MuiDialog-paper': {
                    background: 'linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(118,217,112,1) 0%, rgba(2,55,36,1) 100%)'
                }
            }}
            >
            <img src={CongratsGIF} alt="Congratulations" width="100%"/>
            <DialogTitle sx={{ color: "white", textAlign: 'center', fontWeight: 800, fontSize: 42 }}>
                {entryNumber}
            </DialogTitle>
            <DialogContent>
                <div>
                    <Typography sx={{ color: "white", textAlign: 'center' }}>
                        Full Name: {fullName}
                    </Typography>
                    <Typography sx={{ color: "white", textAlign: 'center' }}>
                        Card Number: {cardNumber}
                    </Typography>
                    {/* <Typography sx={{ color: "white", textAlign: 'center' }}>
                        Username: {winnerusername}
                    </Typography> */}
                    <Typography sx={{ color: "white", textAlign: 'center' }}>
                        Outlet: {outlet}
                    </Typography>
                    <Typography sx={{ color: "white", textAlign: 'center' }}>
                        Prize: {prize}
                    </Typography>
                </div>
                <Button fullWidth color='warning' onClick={() =>{ setWinnerDialog(false); setEntryNumbers([0,0,0,0,0,0])}} variant='contained' sx={{ mt: 2}}>Close</Button>
            </DialogContent>
        </Dialog>
        </div>
    )
}

export default Raffle