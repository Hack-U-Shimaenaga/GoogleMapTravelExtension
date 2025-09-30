import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputText from '../home/inputText';
import InputNumber from '../home/inputNumber';
import { useState } from 'react';

// PlaceCard.js
export default function PlaceCard({ address, todo, time, dragHandleProps, onChange }) {
  const [input, setInput] = useState({ todo, time });

  const handleChange = (name, value) => {
    const updated = { ...input, [name]: value };
    setInput(updated);
    onChange(updated);  // 親に渡す
  };

  return (
    <Card sx={{ width: "90%", margin: "30px" }}>
      <CardContent>
        <div className="flex items-center justify-between">
          <Typography sx={{ fontSize: "18px" }}>{address}</Typography>
          <div {...dragHandleProps} style={{ cursor: "grab", fontSize: "2rem" }}>☰</div>
        </div>

        <div className="flex items-center space-x-4 mt-2">
          <Typography sx={{ fontSize: "15px" }}>やること</Typography>
          <InputText name="todo" label="To do" value={input.todo} onChange={handleChange} />

          <Typography sx={{ fontSize: "15px" }}>所要時間</Typography>
          <InputNumber name="time" label="Required time" value={input.time} onChange={handleChange} />
          <Typography sx={{ ml: 1 }}>min</Typography>
        </div>
      </CardContent>
    </Card>
  );
}
