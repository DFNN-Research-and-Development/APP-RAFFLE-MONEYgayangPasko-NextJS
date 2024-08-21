"use client"
import Topbar from "../component/Topbar"
import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, Button, Grid, Paper, Toolbar, Autocomplete } from "@mui/material";
import Swal from 'sweetalert2';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useRouter } from "next/navigation";
import Encrypt from "@/app/component/Encryption"
import Decrypt from "@/app/component/Decryption"
import axios from "axios";
import dayjs from 'dayjs';
const MaskData = require('maskdata')

const Reports : React.FC = () => {
    const [disable, setDisable] = useState(false)
    const [disableGen, setDisableGen] = useState(false)
    const [rowData, setRowData] = useState([])
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [getTotal, setGetTotal] = useState(0);
    const [timeFrom, setTimeFrom] = useState<dayjs.Dayjs>(dayjs().set('hour', 6).set('minute', 0).set('second', 0));
    const [timeTo, setTimeTo] = useState<dayjs.Dayjs>(dayjs().set('hour', 5).set('minute', 59).set('second', 59));
    const [outlet, setOutlet] = useState<any>({name: "All", id: 0})
    const csvLink = React.createRef();

    const outletSelection = [
        {id: 0, name: "All"},
        {id: "IEST LuckyU Pilar Bataan", name: "IEST LuckyU Pilar Bataan"},
        {id: "IEST LUCKY U INC. ABUCAY BATAAN", name: "IEST LuckyU inc. Abucay Bataan"}
    ]

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

    const columns = [
        { field: 'OutletName', headerName: 'Outlet Name', width: 350 },
        { field: 'FullName', headerName: 'FullName', width: 350 },
        { field: 'CardNo', headerName: 'Card No.', width: 250 },
        { field: 'EntryNo', headerName: 'Entry No.', width: 250 },
        { field: 'ExtRefId', headerName: 'Reference ID', width: 400 },
        { field: 'GPSource', headerName: 'GP Source', width: 250 },
    ];

    const handleDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateFrom(e.target.value);
    }
    const handleDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDateTo(e.target.value)
    }

    const getRowData = () => {
        setDisableGen(true)
        let timeFromFinal: string = timeFrom.format('HH:mm:ss');
        let timeToFinal: string = timeTo.format('HH:mm:ss');

        if(dateFrom == "" || dateTo == "" || timeFromFinal == "" || timeToFinal == ""){
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: 'Please Fill out the missing fields.',
                heightAuto: false
            }).then(() => {
                setDisableGen(false)
            })
        } else {
            const body = Encrypt(JSON.stringify({
                cardNo: 0,
                dateFrom: `${dateFrom} ${timeFromFinal}`,
                dateTo: `${dateTo} ${timeToFinal}` 
            }))

            axios.post('/api/pineapple', {
                data: body
            }).then((res) => {
                try {
                    const response = JSON.parse(JSON.parse(Decrypt(res.data.res)))
                    const arr = response.data.inplayRaffleResult.map((data: any, index: number) => {
                        return ({
                            id: index,
                            OutletName: data.OutletName,
                            FullName: MaskData.maskStringV2(data.FullName, maskNameConfig),
                            CardNo: MaskData.maskCard(data.CardNo, maskCardConfig),
                            EntryNo: data.EntryNo === null ? "There is no record" : data.EntryNo,
                            ExtRefId: data.ExtRefId,
                            GPSource: data.GPSource,
                            ...data
                        })
                    })
                    setRowData(arr)
                    setDisableGen(false)
                    setGetTotal(arr.length)
                } catch (err) {
                    console.log(err)
                    Swal.fire({
                        title: "Oops..",
                        text: "Failed to get row Data",
                        icon: 'error',
                        heightAuto: false
                    })
                }
            }).catch((err) => {
                console.log(err)
                Swal.fire({
                    title: "Oops..",
                    text: "Failed to get row Data",
                    icon: 'error',
                    heightAuto: false
                })
            })
        }
    }

    return(
        <div className="reports-bg">
            <Topbar disable={disable} path="/reports" />
            <Toolbar />

            <Box sx={{ width: '100%' }}>
                <Paper sx={{display: 'flex', flexDirection: 'column', m: 2, overflow: 'scroll'}}>
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                        <Grid item xs={4} sx={{display: 'flex', alignItems: 'center'}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TextField
                                    label="Date From"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={handleDateFromChange}
                                    defaultValue={null}
                                    type="date"
                                    sx={{ width: 200, m: 2 }}
                                />
                                <TimePicker
                                    ampm={false}
                                    openTo="hours"
                                    views={['hours', 'minutes', 'seconds']}
                                    inputFormat="HH:mm:ss"
                                    mask="::__"
                                    label="Time From"
                                    value={timeFrom}
                                    onChange={(e:any) => {
                                        setTimeFrom(e);
                                    }}
                                    renderInput={(params:any) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TextField
                                    label="Date To"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={handleDateToChange}
                                    defaultValue={null}
                                    type="date"
                                    sx={{ width: 200, m: 2 }}
                                />
                                <TimePicker
                                    ampm={false}
                                    openTo="hours"
                                    views={['hours', 'minutes', 'seconds']}
                                    inputFormat="HH:mm:ss"
                                    mask="__:__:__"
                                    label="Time To"
                                    value={timeTo}
                                    onChange={(newValue:any) => {
                                        setTimeTo(newValue);
                                    }}
                                    renderInput={(params:any) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        
                        <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                            <Button variant='contained' sx={{marginRight: '1rem'}} onClick={getRowData} disabled={disableGen}>{ disableGen === true? "Please wait ..." : "Generate" }</Button>
                        </Grid>
                    
                    </Grid>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', mx: 1}}>
                        <Typography variant='h6' sx={{m: 1, fontWeight: 700}}>Total: {getTotal}</Typography>
                        <CSVLink 
                            style={{
                                backgroundColor: '#00a251',
                                color: 'white',
                                paddingLeft: '15px',
                                paddingRight: '15px',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 3,
                                borderRadius: '2px',
                                fontWeight: '500',
                                textTransform: 'uppercase',
                                fontSize: '14px',
                            }}
                            filename="Reports.csv" 
                            data= {rowData} 
                            headers={[
                                { label: 'Outlet Name', key: 'OutletName' },
                                { label: 'FullName', key: 'FullName' },
                                { label: 'Card No.', key: 'CardNo' },
                                { label: 'Entry No.', key: 'EntryNo' },
                                { label: 'Reference ID', key: 'ExtRefId' },
                                { label: 'GP Source', key: 'GPSource' },
                            ]}
                            >
                                Download File
                            </CSVLink>
                    </Box>
                
                    <DataGrid 
                        disableColumnFilter
                        disableColumnSelector
                        disableDensitySelector
                        rows={rowData}
                        columns={columns}
                        initialState={{
                            pagination: { paginationModel: { pageSize: 10 } }
                        }}
                        slots={{ toolbar: GridToolbarQuickFilter }}
                    />
                
                </Paper>
            </Box>
        </div>
    )
}

export default Reports