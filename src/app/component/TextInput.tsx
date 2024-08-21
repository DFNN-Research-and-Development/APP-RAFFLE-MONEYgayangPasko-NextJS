"use-client"
import React from "react";
import { FormControl, InputLabel, OutlinedInput, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'

interface TextInputProps{
    change: (event: React.ChangeEvent<HTMLInputElement>) => void,
    id: string,
    val: string,
    label: string,
    show?: boolean,
    clickShow?: (event: React.MouseEvent<HTMLButtonElement>) => void,
    type: string,
    required?: boolean
}

const TextInput: React.FC<TextInputProps> = ({
    change,id,val,label,show,clickShow,type,required
}) => {
    return (
        <FormControl 
            fullWidth 
            variant="outlined"
            sx={{
                marginTop: '0.5rem',
                marginBottom: '1rem',
                width: '100%'
            }}
            >
            <InputLabel className='login-input' htmlFor="outlined-adornment" >{label}</InputLabel>
                {
                    id !== "password" ?
                    <>
                        <OutlinedInput
                            sx={{ color: "black", bgcolor: "white" }}
                            id={id}
                            type={type}
                            value={val}
                            onChange={change}
                            label={label}
                            required={required}
                        />
                    </>
                    :
                    <>
                        <OutlinedInput
                            sx={{ color: "black", bgcolor: "white" }}
                            required={required}
                            id={id}
                            type={show ? 'text' : 'password'}
                            value={val}
                            onChange={change}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={clickShow}
                                        edge="end"
                                    >
                                    {show ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </>
                    
                }
        </FormControl>
    )
}

export default TextInput
