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
    padding: 20,
    fontSize: 12,
    fontFamily: "NotoSansJP",
    backgroundColor: "#fdfdfd",

  },

  frame: {
    flex: 1,
    border: "3px solid #249bb3", // 外枠
    borderRadius: 12,
    padding: 20,
  },
  header: {
    textAlign: "center",
    marginBottom: 15,
  },
  dayTitle: {
    fontSize: 24,
    color: "#249bb3",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 13,
    color: "#555",
  },

  scheduleSpace: {
    height: 520, // 行動予定を書くためのスペース
    border: "1px dashed #888",
    padding: 10,
    marginBottom: 10,
  },

  time: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    fontSize: 13,
    color: "#444",
    marginLeft: 5,
  },
  memoBox: {
    border: "1px dashed #aaa",
    borderRadius: 6,
    padding: 10,
    minHeight: 80,
  },
  memoText: {
    fontSize: 12,
    color: "#666",
  },
});

export default function CreatePDF({ tripTitle, date, time, location, addressList }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.frame}>
          {/* ヘッダー */}
          <View style={styles.header}>
            <Text style={styles.dayTitle}>DAY 1</Text>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.dateText}>{tripTitle}</Text>
          </View>

          {/* 行動予定 */}

          <View style={styles.scheduleSpace}></View>

          {/* memo */}
          <View style={styles.memoBox}>
            <Text style={styles.memoText}>memo:</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

