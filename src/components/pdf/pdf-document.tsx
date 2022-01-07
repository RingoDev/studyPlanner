import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { CurriculumType } from "../../types/types";
import { getCourseDisplayTitle } from "../../lib/general";

interface Props {
  curriculum: CurriculumType;
}

// Create Document Component
const PdfDocument = ({ curriculum }: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {curriculum.semesters
          .filter((s) => s.courses.length !== 0)
          .map((semester) => (
            <View key={semester.name} wrap={false} style={styles.section}>
              <View style={tableStyles.table}>
                <View
                  style={{ ...tableStyles.tableRow, ...tableStyles.tableHead }}
                >
                  <View
                    style={{
                      ...tableStyles.tableCell,
                      ...tableStyles.description,
                    }}
                  >
                    <Text style={tableStyles.text}>{semester.name}</Text>
                  </View>
                  <View style={tableStyles.tableCell}>
                    <Text style={tableStyles.text}>ECTS</Text>
                  </View>
                  <View style={tableStyles.tableCell}>
                    <Text style={tableStyles.text}>Note</Text>
                  </View>
                </View>
                {semester.courses.map((course) => (
                  <View key={course.id} style={tableStyles.tableRow}>
                    <View
                      style={{
                        ...tableStyles.tableCell,
                        ...tableStyles.description,
                      }}
                    >
                      <Text style={tableStyles.text}>
                        {getCourseDisplayTitle(course)}
                      </Text>
                    </View>
                    <View style={{ ...tableStyles.tableCell }}>
                      <Text style={tableStyles.text}>{course.ects}</Text>
                    </View>
                    <View style={tableStyles.tableCell}>
                      <Text style={tableStyles.text}> </Text>
                    </View>
                  </View>
                ))}
                {semester.customEcts !== 0 ? (
                  <View key={semester.name} style={tableStyles.tableRow}>
                    <View
                      style={{
                        ...tableStyles.tableCell,
                        ...tableStyles.description,
                      }}
                    >
                      <Text style={tableStyles.text}>
                        Freie Studienleistungen
                      </Text>
                    </View>
                    <View style={{ ...tableStyles.tableCell }}>
                      <Text style={tableStyles.text}>
                        {semester.customEcts}
                      </Text>
                    </View>
                    <View style={tableStyles.tableCell}>
                      <Text style={tableStyles.text}> </Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          ))}
      </Page>
    </Document>
  );
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 10,
  },
  section: {
    margin: 10,
  },
});

const tableStyles = StyleSheet.create({
  table: {
    display: "flex",
    flexDirection: "column",
    fontSize: 10,
  },
  tableHead: {
    backgroundColor: "#cccccc",
    border: "none",
  },
  tableRow: {
    borderBottomColor: "#999999",
    borderBottomStyle: "solid",
    borderBottomWidth: 0.5,
    borderRightColor: "#999999",
    borderRightStyle: "solid",
    borderRightWidth: 0.5,
    display: "flex",
    flexDirection: "row",
  },
  tableCell: {
    borderLeftColor: "#999999",
    borderLeftStyle: "solid",
    borderLeftWidth: 0.5,
    flexGrow: 1,
    flexShrink: 3,
    flexBasis: 1 / 16,
    padding: "5 5",
    // textAlign:"center"
  },
  description: {
    flexGrow: 2,
    flexBasis: 2,
  },
  text: {
    marginRight: "auto",
    marginVertical: "auto",
  },
});

export default PdfDocument;
