import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "-";

const csvEscape = (value) => {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const downloadCsv = (fileName, rows) => {
  const content = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const safeName = (value) =>
  (value || "report")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function downloadOrganizerReportCsv(report) {
  const rows = [
    ["Event Title", report.event.title],
    ["Category", report.event.category],
    ["Date", formatDateTime(report.event.startDate)],
    ["Location", report.event.location],
    ["Ticket Type", report.event.ticketType],
    ["Capacity", report.event.capacity],
    ["Total Registrations", report.metrics.totalRegistrations],
    ["Checked In", report.metrics.checkedInCount],
    ["Pending", report.metrics.pendingCount],
    ["Check-in Rate", `${report.metrics.checkInRate}%`],
    ["Revenue", report.metrics.totalRevenue],
    [],
    ["Name", "Email", "Status", "Registered At", "Checked In", "Checked In At", "QR Code"],
    ...report.attendees.map((row) => [
      row.attendeeName,
      row.attendeeEmail,
      row.status,
      formatDateTime(row.registeredAt),
      row.checkedIn ? "Yes" : "No",
      formatDateTime(row.checkedInAt),
      row.qrCode,
    ]),
  ];
  downloadCsv(`${safeName(report.event.title)}-organizer-report.csv`, rows);
}

export function downloadTicketReportCsv(report) {
  const rows = [
    [
      "Event Title",
      "Attendee Name",
      "Attendee Email",
      "Date",
      "Location",
      "Status",
      "Checked In",
      "Checked In At",
      "Ticket ID",
    ],
    [
      report.event.title,
      report.attendeeName,
      report.attendeeEmail,
      formatDateTime(report.event.startDate),
      report.event.location,
      report.status,
      report.checkedIn ? "Yes" : "No",
      formatDateTime(report.checkedInAt),
      report.qrCode,
    ],
  ];
  downloadCsv(`${safeName(report.event.title)}-my-ticket.csv`, rows);
}

export function downloadHistoryReportCsv(report) {
  const rows = [
    ["Total Registrations", report.summary.totalRegistrations],
    ["Upcoming", report.summary.upcomingCount],
    ["Past", report.summary.pastCount],
    ["Cancelled", report.summary.cancelledCount],
    [],
    ["Event", "Date", "Location", "Ticket Type", "Status", "Checked In", "Registered At", "Checked In At", "Ticket ID"],
    ...report.rows.map((row) => [
      row.eventTitle,
      formatDateTime(row.startDate),
      row.location,
      row.ticketType,
      row.status,
      row.checkedIn ? "Yes" : "No",
      formatDateTime(row.registeredAt),
      formatDateTime(row.checkedInAt),
      row.qrCode,
    ]),
  ];
  downloadCsv("my-registrations-history.csv", rows);
}

function savePdf(doc, name) {
  doc.save(name);
}

export function downloadOrganizerReportPdf(report) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Organizer Event Report", 14, 18);
  doc.setFontSize(11);
  doc.text(`Event: ${report.event.title}`, 14, 28);
  doc.text(`Date: ${formatDateTime(report.event.startDate)}`, 14, 34);
  doc.text(`Location: ${report.event.location}`, 14, 40);

  autoTable(doc, {
    startY: 46,
    head: [["Metric", "Value"]],
    body: [
      ["Total Registrations", String(report.metrics.totalRegistrations)],
      ["Checked In", String(report.metrics.checkedInCount)],
      ["Pending", String(report.metrics.pendingCount)],
      ["Check-in Rate", `${report.metrics.checkInRate}%`],
      ["Revenue", String(report.metrics.totalRevenue)],
    ],
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 8,
    head: [["Name", "Email", "Status", "Registered At", "Checked In", "Checked In At", "QR Code"]],
    body: report.attendees.map((row) => [
      row.attendeeName,
      row.attendeeEmail,
      row.status,
      formatDateTime(row.registeredAt),
      row.checkedIn ? "Yes" : "No",
      formatDateTime(row.checkedInAt),
      row.qrCode,
    ]),
    styles: { fontSize: 8 },
  });

  savePdf(doc, `${safeName(report.event.title)}-organizer-report.pdf`);
}

export function downloadTicketReportPdf(report) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("My Event Ticket Report", 14, 18);
  doc.setFontSize(11);
  doc.text(`Event: ${report.event.title}`, 14, 28);
  doc.text(`Attendee: ${report.attendeeName}`, 14, 34);

  autoTable(doc, {
    startY: 42,
    head: [["Field", "Value"]],
    body: [
      ["Attendee Email", report.attendeeEmail],
      ["Date", formatDateTime(report.event.startDate)],
      ["Location", report.event.location],
      ["Registration Status", report.status],
      ["Checked In", report.checkedIn ? "Yes" : "No"],
      ["Checked In At", formatDateTime(report.checkedInAt)],
      ["Ticket ID", report.qrCode],
    ],
  });

  savePdf(doc, `${safeName(report.event.title)}-my-ticket.pdf`);
}

export function downloadHistoryReportPdf(report) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("My Registration History Report", 14, 18);

  autoTable(doc, {
    startY: 26,
    head: [["Summary", "Value"]],
    body: [
      ["Total Registrations", String(report.summary.totalRegistrations)],
      ["Upcoming", String(report.summary.upcomingCount)],
      ["Past", String(report.summary.pastCount)],
      ["Cancelled", String(report.summary.cancelledCount)],
    ],
  });

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 8,
    head: [["Event", "Date", "Location", "Type", "Status", "Checked In", "Registered At", "Ticket ID"]],
    body: report.rows.map((row) => [
      row.eventTitle,
      formatDateTime(row.startDate),
      row.location,
      row.ticketType,
      row.status,
      row.checkedIn ? "Yes" : "No",
      formatDateTime(row.registeredAt),
      row.qrCode,
    ]),
    styles: { fontSize: 8 },
  });

  savePdf(doc, "my-registrations-history.pdf");
}
