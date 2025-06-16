import {jsPDF} from "jspdf";

export const downloadSVG = async (svgString, filename = 'qrcode.svg') => {
    if (!svgString) return;

    const blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const downloadPDF = async (svgString, size, filename = 'qrcode.pdf') => {
    if (!svgString) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const pngData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({orientation: 'portrait', unit: 'px', format: [size, size]});
        pdf.addImage(pngData, 'PNG', 0, 0, size, size);
        pdf.save(filename);
    };
    const blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    img.src = URL.createObjectURL(blob);
};