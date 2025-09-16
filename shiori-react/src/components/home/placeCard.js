import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputText from '../home/inputText';
import InputNumber from '../home/inputNumber';
import { useState } from 'react';

export default function PlaceCard({address}) {
  const [input, setInput] = useState({
      todo: "観光",
      time: ""
  });

  const onChangeInput = (name, value) => {
      setInput({
      ...input,
      [name]: value,
      });
  };
  

  return (
    <Card sx={{ width: "90%", margin: "30px"}}>
      <CardContent>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: "18px" }}>
          {address}
        </Typography>
        <div className="flex items-center space-x-4 mt-2">
        <Typography sx={{ mt: 1.5, fontSize: "15px" }}>やること</Typography>
        <InputText 
          name="todo"
          label="To do"
          value={input.todo}
          onChange={onChangeInput}
          sx={{ width: "20rem", mt: "10px", backgroundColor: "#FFFFFF"}}
        />
        <Typography sx={{ mt: 1.5, fontSize: "15px" }}>所要時間</Typography>

        <div
          className='flex items-end'
        >
          <InputNumber
            name="time"
            label="Required time"
            value={input.time}
            onChange={onChangeInput}
            sx={{ width: "15rem", mt: "10px", backgroundColor: "#FFFFFF"}}
          />
          <Typography sx={{"margin-left": '1rem'}}>min</Typography>

        </div>
        </div>
      </CardContent>
    </Card>
  );
}