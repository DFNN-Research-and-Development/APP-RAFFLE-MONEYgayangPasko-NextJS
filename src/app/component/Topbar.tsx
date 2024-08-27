import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, DialogContent, Backdrop, CircularProgress, AppBar, Box, Toolbar, IconButton, Typography, Container, TextField, Button, Badge, Stack } from '@mui/material';
import Encrypt from '@/app/component/Encryption'
import Decrypt from '@/app/component/Decryption'
import { DataGrid } from '@mui/x-data-grid'
import { CSVLink } from "react-csv"
import ExitToAppTwoToneIcon from '@mui/icons-material/ExitToAppTwoTone'
import { Close } from '@mui/icons-material'
import Swal from 'sweetalert2'
import moment from 'moment'
import axios from 'axios'
import { useRouter } from 'next/navigation';



interface TopbarProps {
    disable: boolean,
    arr?: any,
    arr2?: any,
    countWinner?: number
    path: string,
    overallEntries?: number,
}

const Topbar: React.FC<TopbarProps> = ({ disable, arr, arr2, countWinner, path, overallEntries }) => {
    const router = useRouter()
    const username =  "GAMEFINITY"
    const [currentDate, setCurrentDate] = useState<any>()
    const [winnerDialog, setWinnerDialog] = useState(false)
    const [generateEntryDialog, setGenerateEntryDialog] = useState(false)
    const [chosen, setChosen] = useState([]);
    const [cardNumber, setCardNumber] = useState('')
    const [generatedData, setGeneratedData] = useState([])
    const [fresh, setFresh] = useState(true);
    const [loader, setLoader] = useState(false)
    const [loading, setLoading] = useState(false)

 

    useEffect(() => {
        
        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "F9") {
            setGenerateEntryDialog(true);
          }
        };
    
        // Add event listener when component mounts
        document.addEventListener("keydown", handleKeyDown);
    
        const intervalId = setInterval(() => {
            setCurrentDate(moment().format("MMM DD, YYYY HH:mm:ss a"))
        }, 1000)

        // Remove event listener when component unmounts
        return () => {
          document.removeEventListener("keydown", handleKeyDown);
          clearInterval(intervalId)
        };
      }, []);


    const columnsWinners = [
        { field: 'No', headerName: '#', width: 20 },
        { field: 'FullName', headerName: 'Full Name', width: 250 },
        { field: 'EntryNo', headerName: 'Entry No', width: 80 },
        { field: 'CardNo', headerName: 'Card No', width: 200 },
        { field: 'OutletName', headerName: 'Outlet', width: 220 },
        { field: 'DrawPrize', headerName: 'Draw Prize', width: 300 },
        { field: 'DrawDate', headerName: 'Draw Date', width: 200 },
    ]

    const columnsGD = [
        { field: 'EntryNo', headerName: 'Entry Number', width: 300 },
        { field: 'GPSource', headerName: 'Raffle Program', width: 250 },
        { field: 'EntryId', headerName: 'Reference No', width: 250 },
    ]

    const handleClickLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true)
        Swal.fire({
            title: "Select Preferred Action",
            icon: "question",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#349732",
            denyButtonColor: '#3085d6',
            confirmButtonText: "Logout",
            denyButtonText: "Reports",
            cancelButtonText: 'Raffle',
            allowOutsideClick: false,
            heightAuto: false,
          }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem('data')
                setLoading(false)
                router.push('/')
            } else if (result.isDenied){
                setLoading(false)
                router.push('/reports')
            } else if (result.isDismissed){
                setLoading(false)
                router.push('/raffle')
            }
          });
    }

    const handleSearchByNo = () => {
        setLoader(true)
        const body = Encrypt(JSON.stringify({
            cardNo: cardNumber
        }))
        try {
            axios.post('/api/chocolatejam', {
                data: body
            }).then((res) => {
                try{
                    const response = JSON.parse(JSON.parse(Decrypt(res.data.res)))
                    const arr = response.results.map((res: any, index: number) => {
                        return ({
                          id: index,
                          EntryNo: res.EntryNo,
                          GPSource: res.GPSource,
                          EntryId: res.EntryId
                        })
                    })
                    setGeneratedData(response.results)
                    setChosen(arr)
                    setFresh(false)
                    setLoader(false)
                } catch(err) {
                    console.log(err)
                    setLoader(false)
                    setGenerateEntryDialog(false)
                    Swal.fire({
                        title: 'Oops..',
                        text: "There's something wrong with parsing the data, please try again later",
                        icon: 'error',
                        heightAuto: false
                    })
                    
                }
            })
        } catch (err) {
            console.log(err)
            setLoader(true)
            setGenerateEntryDialog(false)
            Swal.fire({
                title: 'Oops..',
                text: "There's something wrong with fetching the data, please try again later",
                icon: 'error',
                heightAuto: false
            })
            
        }
    }

    return(
        <div >
            <Backdrop open={loading} sx={{ zIndex: 1111111 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AppBar position="fixed" sx={{ bgcolor: "#13654C", borderBottom: '#FFD8A6 solid 3px' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>

                    {
                        path === '/raffle' ? 
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
                            <Typography sx={{ color: "white"}}>Overall Entries: <b>{overallEntries}</b></Typography>
                        </Box>
                        :
                        ""
                    }
                    

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    </Box>

                    <Box sx={{ flexGrow: 0, display: 'flex' }}>
                        <Typography sx={{ p: 3, pl: 1}}>{currentDate}</Typography>
                        {
                            path === '/raffle' ? 
                            <IconButton disabled={disable} sx={{ p: 0 }} onClick={() => setWinnerDialog(true)}>
                                <Badge badgeContent={countWinner === null ? 0 : countWinner} color='warning'>
                                    <Box sx={{ bgcolor: "white", color: "#006242", px: 1, borderRadius: 1, fontSize: "20px", display: 'flex', alignItems: 'center', justifyItems: 'center' }}> 
                                        <Typography sx={{ pr: 1, pl: 1, py: 0.5 }}> Winners</Typography>
                                    </Box>
                                </Badge>
                            </IconButton>
                            : ""
                        }
                        <Typography sx={{ color: "white", p: 3, pl: 5 }}> {username}</Typography>
                        <IconButton disabled={disable} sx={{ p: 0, pl: 2 }} onClick={handleClickLogout}>
                            <ExitToAppTwoToneIcon sx={{ color: "white" }} />
                        </IconButton>
                    </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            
        <Dialog
            open={winnerDialog}
            onClose={() => setWinnerDialog(false)}
            fullWidth
            maxWidth={'xl'} 
            >
          <DialogTitle>All Winners</DialogTitle>
            <IconButton 
                aria-label='close'
                onClick={() => {
                    setWinnerDialog(false)
                }}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[800],
                }}>
              <Close />
            </IconButton>
          <DialogContent>
          <CSVLink 
                filename='all_winners_mgp_raffle' 
                data={arr2} 
                style={{
                    backgroundColor: "#00a251",
                    borderRadius: "4px",
                    padding: "6px 16px",
                    color: "white",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    textTransform: "uppercase",
                    boxSizing: "border-box",
                    boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
                    transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                    marginTop: "16px",
                    marginBottom: "16px",
                    lineHeight: "1.75",
                    letterSpacing: "0.02857em",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    verticalAlign: "middle"
                }}
            >
                Save as CSV
            </CSVLink>
            <DataGrid
                sx={{ mt: 2 }}
                columns={columnsWinners}
                rows={arr}
                initialState={{
                    pagination: { paginationModel: { pageSize: 10 } },
                    sorting: {
                        sortModel: [{ field: "No", sort: 'asc'}]
                    }
                }}
            />
          </DialogContent>
        </Dialog>


        <Dialog 
          open={generateEntryDialog}
          onClose={() => {
            setGenerateEntryDialog(false)
            setCardNumber('')
            setChosen([])
            setFresh(true)
          }}
          sx={{
            '& .MuiDialog-paper': {
              minWidth: "900px",
              maxHeight: "700px"
            }
          }}
        >
            <DialogTitle>
                Generate Player Entries
            </DialogTitle>
            <IconButton 
                aria-label='close'
                onClick={() => {
                setGenerateEntryDialog(false)
                setCardNumber('')
                setChosen([])
                setFresh(true)
                }}
                sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[800],
                }}>
                <Close />
                </IconButton>
            <DialogContent>
                <TextField fullWidth label="Card Number" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}/>
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Button variant="contained" sx={{ my: 2 }} onClick={handleSearchByNo} disabled={ loader }  > { loader ? <CircularProgress  color='info' /> : "Search" } </Button>
                    {
                        fresh ? 
                            "" 
                        : 
                            <CSVLink 
                                filename="Player_Entries.csv" 
                                data= {generatedData} 
                                style={{
                                    backgroundColor: "#00a251",
                                    borderRadius: "4px",
                                    padding: "6px 16px",
                                    color: "white",
                                    fontWeight: 500,
                                    fontSize: "0.875rem",
                                    textDecoration: "none",
                                    textTransform: "uppercase",
                                    boxSizing: "border-box",
                                    boxShadow: "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
                                    transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                                    marginTop: "16px",
                                    marginBottom: "16px",
                                    lineHeight: "1.75",
                                    letterSpacing: "0.02857em",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    verticalAlign: "middle"
                                }}
                            >
                                Save as CSV
                            </CSVLink>
                        
                    }
                </Stack>
                <Box sx={{width: "100%"}}>
                    <DataGrid
                        sx={{ mt: 2 }}
                        columns={columnsGD}
                        rows={chosen}
                        initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                        }}
                    />
                </Box>
            </DialogContent>
        </Dialog>

        </div>
    )
}

export default Topbar