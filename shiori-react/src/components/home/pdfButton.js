import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MyPDF from "../../shiori/pdfDummy";
import { PDFDownloadLink } from "@react-pdf/renderer";


export default function PdfButton() {
  return (
    <Stack spacing={2} direction="row">
      <PDFDownloadLink document={<MyPDF />} fileName="sample.pdf">
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

