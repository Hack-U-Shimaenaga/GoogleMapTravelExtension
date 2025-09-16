import React from 'react';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import Container from '@mui/material/Container';
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import PlaceCard from "../components/home/placeCard";
import InputText from "../components/home/inputText";

export default function Home({ className }) {
    // フォームinit
    const [input, setInput] = useState({
        tripTitle: "〇〇旅行"
    });

    const onChangeInput = (name, value) => {
        setInput({
        ...input,
        [name]: value,
        });
    };

    // 日付入力フォームinit
    const today = dayjs().format("YYYY-MM-DD")
    const [date, setDate] = useState(today);                      // 日付を保持
    const [dateBlankError, setDateBlankError] = useState(false);  // 日付が空欄の時のエラー
    const [dateTodayError, setDateTodayError] = useState(false);

    const onChangeDate = (event) => {
        setDate(event.target.value);
        if (event.target.value) {    //入力されたらエラーを解除する
            setDateBlankError(false);
        }
        if (!dayjs(event.target.value).isBefore(today)) {    //入力された日付が今日の日付と同じか後なら、エラーを解除する
            setDateTodayError(false);
        }
    };

    const onBlurDate = (event) => {
        if (!event.target.value) {     //空欄ならエラーをtrueにする
            setDateBlankError(true);
        }
        if (dayjs(event.target.value).isBefore(today)) {     //入力された日付が今日の日付よりも前なら、エラーをtrueにする
            setDateTodayError(true);
        }
    };

    // 時間入力init
    const [time, setTime] = useState({
        startat: dayjs().hour(9).minute(0),
        endat: dayjs().hour(18).minute(0)
    });

    const [timeBlankError, setTimeBlankError] = useState(false);
    const [timeOrderError, setTimeOrderError] = useState(false);

    const onChangeTime = (field, newValue) => {
        if (!newValue) {
            setTimeBlankError(true);
            return;
        }

        setTime((prev) => ({ ...prev, [field]: newValue }));

        // 入力が揃っているとき順序チェック
        if (field === "startat" && newValue && time.endat) {
            setTimeOrderError(!newValue.isBefore(time.endat));
        }
        if (field === "endat" && newValue && time.startat) {
            setTimeOrderError(!time.startat.isBefore(newValue));
        }

        setTimeBlankError(false);
    };

    const onBlurTime = () => {
        if (!time.startat || !time.endat) {
            setTimeBlankError(true);
        } else if (!time.startat.isBefore(time.endat)) {
            setTimeOrderError(true);
        }
    };   



    return(
        <div
            className='bg-white-1'
        >
            <Container fixed className={`${className}`}>
                <div>
                    <h1 className=' text-lg'>旅行のタイトルを決めましょう！</h1>
                    <InputText
                        name="tripTitle"
                        label="Title"
                        value={input.tripTitle}
                        onChange={onChangeInput}
                        sx={{ width: "32rem", mt: "15px", backgroundColor: "#FFFFFF"}}
                    />

                </div>
                <div 
                    className='mt-8'
                >
                    <p>旅行の日程</p>
                    <TextField
                        type="date"
                        label="Date"
                        value={date}
                        onChange={onChangeDate}
                        onBlur={onBlurDate}
                        error={dateBlankError || dateTodayError}
                        helperText={
                            dateBlankError
                            ? "日付を入力してください"
                            : dateTodayError
                            ? "今日より前の日付は入力できません"
                            : ""
                        }
                        sx={{ width: "16rem", mt: "15px", backgroundColor: "#FFFFFF"}}
                    />
                </div>
                <div
                    className='mt-8'
                >
                    <p>旅行の開始時刻と終了時刻を入力してください</p>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div style={{ display: "flex", gap: "1rem", "margin-top": "15px" }}>
                            <TimePicker
                            label="Departure"
                            value={time.startat}
                            onChange={(newValue) => onChangeTime("startat", newValue)}
                            onClose={onBlurTime}
                            slotProps={{
                                textField: {
                                error: timeBlankError || timeOrderError,
                                helperText: timeBlankError
                                    ? "開始・終了時刻を入力してください"
                                    : timeOrderError
                                    ? "終了時間は開始時間より後にしてください"
                                    : ""
                                }
                            }}
                            sx={{ backgroundColor: "#FFFFFF" }}
                            />

                            <TimePicker
                            label="Return"
                            value={time.endat}
                            onChange={(newValue) => onChangeTime("endat", newValue)}
                            onClose={onBlurTime}
                            slotProps={{
                                textField: {
                                error: timeBlankError || timeOrderError,
                                helperText: timeBlankError
                                    ? "開始・終了時刻を入力してください"
                                    : timeOrderError
                                    ? "終了時間は開始時間より後にしてください"
                                    : ""
                                }
                            }}
                            sx={{ backgroundColor: "#FFFFFF" }}
                            />
                        </div>
                    </LocalizationProvider>
                </div>
                <p className='mt-8'>行動計画</p>
                <div
                    className='mt-2'
                >
                    <PlaceCard />
                </div>

            </Container>
        </div>



    )
    
}