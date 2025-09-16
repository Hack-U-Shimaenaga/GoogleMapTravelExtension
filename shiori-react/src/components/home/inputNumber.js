import * as React from 'react';
import TextField from '@mui/material/TextField';
import { useState } from "react";

export default function InputText({ name, label, value, onChange, sx }) {
  const [inputError, setInputError] = useState(false);
  
  const handleChange = (e) => {
  const val = e.target.value;
  if (/^[1-9][0-9]*$/.test(val) || val === "") {
    onChange(name, val); // 親に通知
    if (val) setInputError(false);
  }
    
  };

  const handleBlur = (e) => {
    if (!e.target.value) {
      setInputError(true);
    }
  };

  return (
    <TextField
        id="outlined-required"
        label={label}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={inputError}
        helperText={inputError ? "入力してください" : ""}
        type='number'
        
        sx={sx}
    />
  );
}