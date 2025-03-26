import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import {
  validateTimetableData,
  validateTimetableName,
} from "./validationUtils";

export type TimetableSession = {
  course: string;
  teacher: string;
  room: string;
};

export type TimetableData = {
  [day: string]: {
    [time: string]: TimetableSession | undefined;
  };
};

export const downloadAsPDF = (timetable: TimetableData, name: string): void => {
  // Validate timetable name
  if (!name || typeof name !== "string") {
    throw new Error("Timetable name must be a valid string");
  }

  const nameError = validateTimetableName(name);
  if (nameError) {
    throw new Error(nameError.message);
  }

  const validation = validateTimetableData(timetable);
  if (!validation.isValid) {
    throw new Error(
      `Invalid timetable data: ${validation.errors
        .map((e) => e.message)
        .join(", ")}`
    );
  }

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(16);
    doc.text(name, pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(10);
    let yPos = 40;
    const days = Object.keys(timetable);
    const times = days.length > 0 ? Object.keys(timetable[days[0]] || {}) : [];
    const cellWidth = (pageWidth - 40) / (days.length + 1);

    // Set bold font for table headers
    doc.setFont("helvetica", "bold");
    doc.text("Time", 20, yPos);
    days.forEach((day, index) => {
      doc.text(day, 20 + cellWidth * (index + 1), yPos);
    });
    doc.setFont("helvetica", "normal");

    // Fill the timetable with course, teacher, and room information
    times.forEach((time) => {
      yPos += 15;
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(time, 20, yPos);
      days.forEach((day, dayIndex) => {
        const session = timetable[day]?.[time];
        if (session) {
          const text = `${session.course}\n${session.teacher}\n${session.room}`;
          doc.text(text, 20 + cellWidth * (dayIndex + 1), yPos, {
            maxWidth: cellWidth - 2,
          });
        }
      });
    });

    doc.save(`${name.toLowerCase().replace(/\s+/g, "_")}_timetable.pdf`);
  } catch (error) {
    throw new Error(
      `Failed to generate PDF: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const downloadAsExcel = (
  timetable: TimetableData,
  name: string
): void => {
  // Validate timetable name
  if (!name || typeof name !== "string") {
    throw new Error("Timetable name must be a valid string");
  }

  const nameError = validateTimetableName(name);
  if (nameError) {
    throw new Error(nameError.message);
  }

  const validation = validateTimetableData(timetable);
  if (!validation.isValid) {
    throw new Error(
      `Invalid timetable data: ${validation.errors
        .map((e) => e.message)
        .join(", ")}`
    );
  }

  try {
    const days = Object.keys(timetable);
    const times = days.length > 0 ? Object.keys(timetable[days[0]] || {}) : [];
    const wsData = [
      ["Time", ...days],
      ...times.map((time) => [
        time,
        ...days.map((day) => {
          const session = timetable[day]?.[time];
          return session
            ? `${session.course}\n${session.teacher}\n${session.room}`
            : "";
        }),
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timetable");

    // Adjust column widths
    const colWidths = wsData[0].map((_, i) =>
      Math.max(...wsData.map((row) => (row[i]?.toString() || "").length))
    );
    ws["!cols"] = colWidths.map((w) => ({ wch: Math.min(w + 5, 50) }));

    XLSX.writeFile(
      wb,
      `${name.toLowerCase().replace(/\s+/g, "_")}_timetable.xlsx`
    );
  } catch (error) {
    throw new Error(
      `Failed to generate Excel file: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

export const downloadAsCSV = (timetable: TimetableData, name: string): void => {
  // Validate timetable name
  if (!name || typeof name !== "string") {
    throw new Error("Timetable name must be a valid string");
  }

  const nameError = validateTimetableName(name);
  if (nameError) {
    throw new Error(nameError.message);
  }

  const validation = validateTimetableData(timetable);
  if (!validation.isValid) {
    throw new Error(
      `Invalid timetable data: ${validation.errors
        .map((e) => e.message)
        .join(", ")}`
    );
  }

  try {
    const days = Object.keys(timetable);
    const times = days.length > 0 ? Object.keys(timetable[days[0]] || {}) : [];
    const csvContent = [
      ["Time", ...days].join(","),
      ...times.map((time) =>
        [
          time,
          ...days.map((day) => {
            const session = timetable[day]?.[time];
            return session
              ? `"${session.course} - ${session.teacher} (${session.room})"`
              : "";
          }),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name.toLowerCase().replace(/\s+/g, "_")}_timetable.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    throw new Error(
      `Failed to generate CSV file: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};
