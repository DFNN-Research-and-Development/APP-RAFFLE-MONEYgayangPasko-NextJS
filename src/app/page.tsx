'use client'
import * as React from 'react'
import { Box, Button, Grid, Stack, Typography, FormControl, InputLabel, Select, MenuItem, ListSubheader, SelectChangeEvent } from '@mui/material'
import TextInput from '@/app/component/TextInput'
import Encrypt from '@/app/component/Encryption'
import Swal from 'sweetalert2'
import moment from 'moment'
import { useRouter } from 'next/navigation'


//Images 
const InstawinLogo = './images/components/Instawin.png'
const InplayLogo = './images/components/Inplay.png'
const LuckyULogo = './images/components/LuckyU_Logo.png'
const RaffleTitle = './images/components/title logo-shine.png'

const Home: React.FC = () => {
  
  const router = useRouter()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [drawWeekDate, setDrawWeekDate] = React.useState('')
  const [drawDate, setDrawDate] = React.useState('')
  const [drawWeek, setDrawWeek] = React.useState('')
  const arrPerson = [
    {name:'MGP2024',password:'@MGP@', session: 2},
    {name:'CS_user12',password:'nJ617',  session: 1}
  ]

  const dateSelection = [
    {date: "2024-08-30", week: "WEEK-1-FRI"},
    {date: "2024-09-03", week: "WEEK-1-TUE"},
    {date: "2024-09-06", week: "WEEK-2-FRI"},
    {date: "2024-09-10", week: "WEEK-2-TUE"},
    {date: "2024-09-13", week: "WEEK-3-FRI"},
    {date: "2024-09-17", week: "WEEK-3-TUE"},
    {date: "2024-09-20", week: "WEEK-4-FRI"},
    {date: "2024-09-24", week: "WEEK-4-TUE"},
    {date: "2024-09-27", week: "WEEK-5-FRI"},
    {date: "2024-10-01", week: "WEEK-5-TUE"},
    {date: "2024-10-04", week: "WEEK-6-FRI"},
    {date: "2024-10-08", week: "WEEK-6-TUE"},
    {date: "2024-10-11", week: "WEEK-7-FRI"},
    {date: "2024-10-15", week: "WEEK-7-TUE"},
    {date: "2024-10-18", week: "WEEK-8-FRI"},
    {date: "2024-10-22", week: "WEEK-8-TUE"},
    {date: "2024-10-25", week: "WEEK-9-FRI"},
    {date: "2024-10-29", week: "WEEK-9-TUE"},
    {date: "2024-11-01", week: "WEEK-10-FRI"},
    {date: "2024-11-05", week: "WEEK-10-TUE"},
    {date: "2024-11-08", week: "WEEK-11-FRI"},
    {date: "2024-11-12", week: "WEEK-11-TUE"},
    {date: "2024-11-15", week: "WEEK-12-FRI"},
    {date: "2024-11-19", week: "WEEK-12-TUE"},
    {date: "2024-11-22", week: "WEEK-13-FRI"},
    {date: "2024-11-26", week: "WEEK-13-TUE"},
    {date: "2024-11-29", week: "WEEK-14-FRI"},
    {date: "2024-12-03", week: "WEEK-14-TUE"},
    {date: "2024-12-06", week: "WEEK-15-FRI"},
    {date: "2024-12-10", week: "WEEK-15-TUE"},
    {date: "2024-12-13", week: "WEEK-16-FRI"},
    {date: "2024-12-17", week: "WEEK-16-TUE"},
    {date: "2024-12-20", week: "GRAND"}
  ];
  
  const groupedDates = dateSelection.reduce((acc: any, item) => {
    const weekNumber = item.week.split('-')[0] === "GRAND" ? item.week.split('-')[0] : `${item.week.split('-')[0]}-${item.week.split('-')[1]}`;
    if (!acc[weekNumber]) {
      acc[weekNumber] = [];
    }
    acc[weekNumber].push({ date: item.date, fullWeek: item.week });
    return acc;
  }, {});

  const prizes = [
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
  ]

  const grandPrize = [
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '777 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '888 Load Credits',
    '2,000 Load Credits',
    '2,000 Load Credits',
    '2,000 Load Credits',
    '2,000 Load Credits',
    '2,000 Load Credits',
    '2,000 Load Credits',
    '2,000 Load Credits',
    '2,000 Load Credits',
    '2,000 Load Credits',
    '2,000 Load Credits',
    '3,000 Load Credits',
    '3,000 Load Credits',
    '3,000 Load Credits',
    '3,000 Load Credits',
    '3,000 Load Credits',
    '3,000 Load Credits',
    '3,000 Load Credits',
    '3,000 Load Credits',
    '3,000 Load Credits',
    '3,000 Load Credits',
    '5,000 Load Credits',
    '5,000 Load Credits',
    '5,000 Load Credits',
    '5,000 Load Credits',
    '5,000 Load Credits',
    '5,000 Load Credits',
    '5,000 Load Credits',
    '5,000 Load Credits',
    '5,000 Load Credits',
    '5,000 Load Credits',
    '3rd Prize 20,000 Load Credits',
    '2nd Prize 50,000 Load Credits',
    '1st Prize 200,000 Load Credits',
  ]

  React.useEffect(() => {
    if (typeof window !== 'undefined'){
      const data: any = typeof window !== 'undefined' ? sessionStorage.getItem("data") : false
      if(data !== null){
        router.push("/raffle")
      }
    }
  }, [])


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (username === "" || password === ""){
      Swal.fire({
        title: 'Oops...',
        text: 'Please fill the required fields',
        icon: 'error',
        heightAuto: false
      })
    }

    else if (username === arrPerson[0].name && password === arrPerson[0].password){
      Swal.fire({
        title: 'Select Preferred Action',
        showConfirmButton: true,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Reports',
        denyButtonText: "Raffle",
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3ec400',
        denyButtonColor: '#FE9246',
        cancelButtonColor: 'red',
        heightAuto: false
      }).then((result) => {
        const rafflePrize = drawDate === "2024-12-20" ? grandPrize : prizes
        const data = {
          username : username,
          session : arrPerson[1].session,
          category: drawWeek,
          prizes: rafflePrize,
          date: drawDate
        }
        if(result.isConfirmed){
          sessionStorage.setItem("data", Encrypt(JSON.stringify(data)))
          router.push('/reports')
        } else if (result.isDenied) {
          sessionStorage.setItem("data", Encrypt(JSON.stringify(data)))
          router.push('/raffle')
        } else {
          Swal.fire({
            title: 'Canceled',
            text: 'You clicked cancel',
            icon: 'warning',
            heightAuto: false
          })
          router.push("/")
        }
      })
    }

    else if (username === arrPerson[1].name && password === arrPerson[1].password){
      Swal.fire({
        title: 'Select Preferred Action',
        showConfirmButton: true,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Reports',
        denyButtonText: "Raffle",
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#3ec400',
        denyButtonColor: '#FE9246',
        cancelButtonColor: 'red',
        heightAuto: false
      }).then((result) => {
        const rafflePrize = drawDate === "2024-12-20" ? grandPrize : prizes
        const data = {
          username : username,
          session : arrPerson[1].session,
          category: drawWeek,
          prizes: rafflePrize,
          date: drawDate
        }
        if(result.isConfirmed){
          sessionStorage.setItem("data", Encrypt(JSON.stringify(data)))
          router.push('/reports')
        } else if (result.isDenied) {
          sessionStorage.setItem("data", Encrypt(JSON.stringify(data)))
          router.push('/raffle')
        } else {
          Swal.fire({
            title: 'Canceled',
            text: 'You clicked cancel',
            icon: 'warning',
            heightAuto: false
          })
          router.push("/")
        }
      })
    }

    else{
      Swal.fire({
        title: 'Oops...',
        text: 'Incorrect Credentials!',
        icon: 'error',
        heightAuto: false
      }).then(() => {
        setPassword("")
        setUsername("")
      })
    }
  }

  const handleInputUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleInputPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleClickShowPassword = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setShowPassword(!showPassword);
  }

  const handleSelectDrawDate = (e: SelectChangeEvent) => {
    const value = JSON.parse(e.target.value)
    setDrawWeekDate(e.target.value)
    setDrawDate(value[0])
    setDrawWeek(value[1])
  }

  return (
    <main className="login-bg">
      <Box sx={{ width: "80%" }}>
        <Stack direction="column" sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}> 
          {/* <img src={RaffleTitle} width="1200px" alt="Instawin Logo" /> */}
              <Box sx={{ textAlign: "center", width: "40%", background: "radial-gradient(circle, hsla(58, 100%, 68%, 1) 0%, hsla(33, 100%, 70%, 1) 100%)", p: 5, borderRadius: 2 }}>
                <img src={RaffleTitle} width="350px" alt="Raffle Title Logo" />
                <Typography sx={{ transform: 'none', pb: 1, color: "black", textTransform: "uppercase", fontSize: 20 }}>
                  Promo runs <br/> Till December 20, 2024
                </Typography>
                <Typography sx={{ transform: 'none', py: 1, color: "black" }}>
                  Enter to draw raffle winners
                </Typography>
                <form onSubmit={(e) => { handleSubmit(e) }}>
                  <FormControl fullWidth sx={{ bgcolor: "white", borderRadius: 1 }}>
                    <InputLabel id="select-label">Draw Dates</InputLabel>
                    <Select
                      labelId="select-label"
                      label="Draw Dates"
                      value={drawWeekDate}
                      onChange={handleSelectDrawDate}
                    >
                      {
                      Object.keys(groupedDates).flatMap((week) => [
                        <ListSubheader key={week}>{week}</ListSubheader>,
                        ...groupedDates[week].map((data: any) => (
                          <MenuItem key={data.date} value={JSON.stringify([data.date, data.fullWeek])}>
                            {moment(data.date).format("MMM DD, YYYY")}
                          </MenuItem>
                        )),
                      ])
                      }
                    </Select>
                  </FormControl>
                  <TextInput 
                      type="text" 
                      id="username" 
                      change={handleInputUsername}
                      val={username} 
                      label="Username"
                  />
                  <TextInput 
                      type="password" 
                      id="password" 
                      change={handleInputPassword} 
                      val={password} 
                      label="Password" 
                      show={showPassword} 
                      clickShow={handleClickShowPassword}
                  />
                  <Button type="submit" sx={{ bgcolor: "#228300", color: "white", fontWeight: 600, fontSize: "20px", mb: 2}} fullWidth> Login</Button>
                </form>
              </Box>
            
        </Stack>
      </Box>
    </main>
  );
}

export default Home