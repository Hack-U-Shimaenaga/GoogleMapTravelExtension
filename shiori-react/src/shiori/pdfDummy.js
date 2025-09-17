import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";


Font.register({
  family: "NotoSansJP",
  fonts: [
    {
      src: `${process.env.PUBLIC_URL}/fonts/NotoSansJP-Regular.ttf`,
    },
    {
      src: `${process.env.PUBLIC_URL}/fonts/NotoSansJP-Bold.ttf`,
      fontWeight: "bold",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 20,
    fontFamily: "NotoSansJP"
  },
  section: {
    marginBottom: 10
  }
});

export default function MyPDF() {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text>React PDFで生成したサンプル</Text>
        </View>
        <View style={styles.section}>
          <Text>ここにテキストを配置できます</Text>
        </View>
      </Page>
    </Document>
  );
}
