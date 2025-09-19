import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CreatePDF from "../../shiori/pdfDummy";
import { PDFDownloadLink } from "@react-pdf/renderer";


export default function PdfButton({ tripTitle, date, time, location, addressList }) {
  return (
    <Stack spacing={2} direction="row">
      <PDFDownloadLink document={<CreatePDF
        tripTitle={tripTitle}
        date={date}
        time={time}
        location={location}
        addressList={addressList}
        />} 
        fileName="sample.pdf">
        {({ loading }) => (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#249bb3" }}
            component="span" 
          >
            {loading ? "生成中..." : "しおりをダウンロード"}
          </Button>
        )}
      </PDFDownloadLink>
    </Stack>
  );
}

