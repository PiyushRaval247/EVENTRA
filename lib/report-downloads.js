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
    ["Name", "Email", "Status", "Tier", "Price Paid", "Registered At", "Checked In", "Checked In At", "QR Code"],
    ...report.attendees.map((row) => [
      row.attendeeName,
      row.attendeeEmail,
      row.status,
      row.tierName || "General",
      row.pricePaid ?? 0,
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
      "Tier",
      "Price Paid",
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
      report.tierName || "General",
      report.pricePaid ?? 0,
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
    head: [["Name", "Email", "Status", "Tier", "Paid", "Registered At", "Checked In", "QR Code"]],
    body: report.attendees.map((row) => [
      row.attendeeName,
      row.attendeeEmail,
      row.status,
      row.tierName || "General",
      String(row.pricePaid ?? 0),
      formatDateTime(row.registeredAt),
      row.checkedIn ? "Yes" : "No",
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

export function downloadOrganizerOverallReportCsv(report) {
  const rows = [
    ["Organizer Overall Report"],
    [`Generated: ${new Date().toLocaleString()}`],
    [],
    ["Metric", "Value"],
    ["Total Events", report.summary.totalEvents],
    ["Total Registrations", report.summary.totalRegistrations],
    ["Total Revenue", `INR ${report.summary.totalRevenue}`],
    ["Avg Check-in Rate", `${report.summary.avgCheckInRate}%`],
    [],
    ["Event Title", "Date", "Status", "Registrations", "Capacity", "Checked In", "Check-in Rate", "Revenue"],
    ...report.eventStats.map((event) => [
      event.title,
      formatDateTime(event.startDate),
      event.status,
      event.registrations,
      event.capacity,
      event.checkedIn,
      `${event.checkInRate}%`,
      event.revenue,
    ]),
  ];
  downloadCsv("organizer-overall-summary.csv", rows);
}

export function downloadOrganizerOverallReportPdf(report) {
  const doc = new jsPDF();
  
  // Header with logo/accent
  doc.setFillColor(30, 58, 138); // #1e3a8a
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("EVENTRA", 14, 20);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Organizer Overall Summary Report", 14, 30);
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 48);

  autoTable(doc, {
    startY: 54,
    head: [["Global Metric", "Value"]],
    body: [
      ["Total Events Created", String(report.summary.totalEvents)],
      ["Total Registrations", String(report.summary.totalRegistrations)],
      ["Total Revenue Earned", `INR ${report.summary.totalRevenue}`],
      ["Average Check-in Rate", `${report.summary.avgCheckInRate}%`],
    ],
    theme: "striped",
    headStyles: { fillColor: [30, 58, 138] },
  });

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Events Breakdown", 14, doc.lastAutoTable.finalY + 12);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 16,
    head: [["Event Title", "Date", "Status", "Reg", "Check-in", "Revenue"]],
    body: report.eventStats.map((event) => [
      event.title,
      formatDateTime(event.startDate),
      event.status.charAt(0).toUpperCase() + event.status.slice(1),
      `${event.registrations}/${event.capacity}`,
      `${event.checkInRate}%`,
      `INR ${event.revenue}`,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 58, 138] },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  savePdf(doc, "organizer-overall-summary.pdf");
}

