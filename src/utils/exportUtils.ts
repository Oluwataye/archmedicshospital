import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export data to PDF with optional charts
 */
export const exportToPDF = (
    title: string,
    data: any[],
    columns: { header: string; dataKey: string }[],
    chartImage?: string
) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);

    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    let yPosition = 40;

    // Add chart if provided
    if (chartImage) {
        try {
            doc.addImage(chartImage, 'PNG', 14, yPosition, 180, 100);
            yPosition += 110;
        } catch (error) {
            console.error('Error adding chart to PDF:', error);
        }
    }

    // Add table
    autoTable(doc, {
        startY: yPosition,
        head: [columns.map(col => col.header)],
        body: data.map(row => columns.map(col => row[col.dataKey] || '')),
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] }, // Blue header
        styles: { fontSize: 9 },
        margin: { top: 10 },
    });

    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: 'center' }
        );
    }

    // Download
    doc.save(`${title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
};

/**
 * Export data to CSV
 */
export const exportToCSV = (
    filename: string,
    data: any[],
    columns: { header: string; dataKey: string }[]
) => {
    // Create CSV content
    const headers = columns.map(col => col.header).join(',');
    const rows = data.map(row =>
        columns.map(col => {
            const value = row[col.dataKey] || '';
            // Escape commas and quotes
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        }).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Export data to Excel with formatting
 */
export const exportToExcel = (
    filename: string,
    data: any[],
    columns: { header: string; dataKey: string }[],
    sheetName: string = 'Data'
) => {
    // Prepare data for Excel
    const worksheetData = [
        columns.map(col => col.header),
        ...data.map(row => columns.map(col => row[col.dataKey] || ''))
    ];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set column widths
    const columnWidths = columns.map(() => ({ wch: 20 }));
    worksheet['!cols'] = columnWidths;

    // Style header row
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
        if (!worksheet[cellAddress]) continue;

        worksheet[cellAddress].s = {
            font: { bold: true, color: { rgb: 'FFFFFF' } },
            fill: { fgColor: { rgb: '3B82F6' } },
            alignment: { horizontal: 'center', vertical: 'center' }
        };
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Download
    XLSX.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`);
};

/**
 * Capture chart as image for PDF export
 */
export const captureChartAsImage = (chartRef: HTMLElement | null): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!chartRef) {
            reject('Chart element not found');
            return;
        }

        // Use html2canvas if available, otherwise return empty string
        if (typeof window !== 'undefined' && (window as any).html2canvas) {
            (window as any).html2canvas(chartRef).then((canvas: HTMLCanvasElement) => {
                resolve(canvas.toDataURL('image/png'));
            }).catch(reject);
        } else {
            // Fallback: return empty string if html2canvas not available
            resolve('');
        }
    });
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
    return num.toLocaleString();
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
};
