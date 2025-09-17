import React from 'react';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import Container from '@mui/material/Container'
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import PlaceCard from "../components/home/placeCard"
import SortablePlaceList from "../components/home/SortablePlaceList"
import { useEffect } from 'react';
import PdfButton from '../components/home/pdfButton';

export default function Home({ className }) {

    const [addressList, setAddressList] = useState([]);

    // 出発地と最終目的地用のstate
    const [location, setLocation] = useState({
        startLocation: "◯◯ホテル",
        endLocation: "◯◯ホテル"
    });

    const [locationBlankError, setLocationBlankError] = useState(false);

    // 入力変更時
    const onChangeLocation = (field, value) => {
        setLocation((prev) => ({ ...prev, [field]: value }));
        if (value) {
            setLocationBlankError(false);
        }
    };

    // フォーカスアウト時
    const onBlurLocation = () => {
        if (!location.startLocation || !location.endLocation) {
            setLocationBlankError(true);
        }
    };

    useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event.origin !== "http://localhost:3000") return;
            if (event.data.type === "SHIORI_CLICKED") {
                console.log("受信した住所リスト:", event.data.payload.addressList);
                setAddressList(event.data.payload.addressList)
            }
        });

        // もしURLパラメータから受け取る場合
        const params = new URLSearchParams(window.location.search);
        const addressesParam = params.get("addresses");
        if (addressesParam) {
            const parsed = JSON.parse(addressesParam);
            console.log("URLパラメータで受信:", parsed);
            setAddressList(parsed);
        }
    }, []);

    // フォームinit
    const [input, setInput] = useState({
        tripTitle: "〇〇旅行",
        startTime: "",
        endTime: ""
    });

    const [inputError, setInputError] = useState(false);

    const onChangeInput = (event) => {      
        setInput(event.target.value); 
        if (event.target.value) {
            setInputError(false);
        }        
    };

    const onBlurInput = (event) => {   
        if (!event.target.value) {
            setInputError(true);
        }
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
                    <TextField
                        id="outlined-required"
                        label="Title"
                        value={input.tripTitle}
                        onChange={onChangeInput}
                        onBlur={onBlurInput}
                        error={inputError}
                        helperText={inputError ? "入力してください" : ""}
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
                <div className='mt-8'>
                    <p>出発地と最終目的地を入力してください</p>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "15px" }}>
                        <TextField
                            label="出発地"
                            value={location.startLocation}
                            onChange={(e) => onChangeLocation("startLocation", e.target.value)}
                            onBlur={onBlurLocation}
                            error={locationBlankError}
                            helperText={locationBlankError ? "出発地を入力してください" : ""}
                            sx={{ backgroundColor: "#FFFFFF" }}
                        />

                        <TextField
                            label="最終目的地"
                            value={location.endLocation}
                            onChange={(e) => onChangeLocation("endLocation", e.target.value)}
                            onBlur={onBlurLocation}
                            error={locationBlankError}
                            helperText={locationBlankError ? "最終目的地を入力してください" : ""}
                            sx={{ backgroundColor: "#FFFFFF" }}
                        />

                    </div>
                </div>

                <p className='mt-8'>行動計画: 回りたい順に並べ替えてください</p>

                <div
                    className='mt-2'
                >   
                    <SortablePlaceList initialAddresses={addressList} />

                </div>
                <PdfButton />
            </Container>
        </div>



    )
    
}