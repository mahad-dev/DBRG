import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PDFExportOptions {
  title: string;
  headers: string[];
  data: (string | number)[][];
  filename: string;
}

/**
 * Generate and download a properly formatted PDF report
 * @param options - PDF export configuration
 */
export const generatePDFReport = (options: PDFExportOptions): void => {
  const { title, headers, data, filename } = options;

  // Create new PDF document (A4 size, portrait orientation)
  const doc = new jsPDF('p', 'mm', 'a4');

  // Add DBRG logo/title with gold color
  doc.setFontSize(20);
  doc.setTextColor(198, 169, 95); // #C6A95F gold color
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  // Add generation timestamp
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const timestamp = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
  doc.text(timestamp, doc.internal.pageSize.getWidth() / 2, 28, { align: 'center' });

  // Generate table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 35,
    theme: 'grid',
    headStyles: {
      fillColor: [198, 169, 95], // #C6A95F gold color
      textColor: [255, 255, 255], // White text
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [50, 50, 50],
    },
    alternateRowStyles: {
      fillColor: [249, 249, 249], // Light gray for alternate rows
    },
    margin: { top: 35, left: 14, right: 14 },
    styles: {
      lineColor: [221, 221, 221],
      lineWidth: 0.1,
    },
  });

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save the PDF
  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`${filename}_${dateStr}.pdf`);
};

/**
 * Generate CSV file and trigger download
 * @param headers - Column headers
 * @param data - Data rows
 * @param filename - Output filename (without extension)
 */
export const generateCSVReport = (
  headers: string[],
  data: (string | number)[][],
  filename: string
): void => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Generate Excel file and trigger download
 * @param headers - Column headers
 * @param data - Data rows
 * @param filename - Output filename (without extension)
 */
export const generateExcelReport = (
  headers: string[],
  data: (string | number)[][],
  filename: string
): void => {
  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  html += '<head><meta charset="utf-8" />';
  html += '<style>';
  html += 'table { border-collapse: collapse; width: 100%; }';
  html += 'th { background-color: #C6A95F; color: white; border: 1px solid #ddd; padding: 8px; font-weight: bold; }';
  html += 'td { border: 1px solid #ddd; padding: 8px; }';
  html += 'tr:nth-child(even) { background-color: #f9f9f9; }';
  html += '</style>';
  html += '</head><body><table>';
  html += '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
  html += data.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');
  html += '</table></body></html>';

  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
