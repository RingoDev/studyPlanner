import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { getCourseDisplayTitle } from "../../lib/general";
import React from "react";
import Course from "../../types/types";

interface Props {
  course: Course;
}

export const PdfTableRow = ({ course }: Props) => {
  if (course.ects === 0) return null;
  return (
    <View
      key={course.id}
      style={{ ...tableStyles.tableRow, backgroundColor: course.color }}
    >
      <View
        style={{
          ...tableStyles.tableCell,
          ...tableStyles.description,
        }}
      >
        <Text style={tableStyles.text}>{getCourseDisplayTitle(course)}</Text>
      </View>
      <View style={{ ...tableStyles.tableCell }}>
        <Text style={tableStyles.text}>{course.ects}</Text>
      </View>
      <View style={tableStyles.tableCell}>
        <Text style={tableStyles.text}>
          {course.grade === 0 || course.grade === undefined ? "" : course.grade}
        </Text>
      </View>
    </View>
  );
};

const tableStyles = StyleSheet.create({
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
