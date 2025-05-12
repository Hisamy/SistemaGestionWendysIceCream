import jsPDF from 'jspdf';
import 'jspdf-autotable';

class TicketService {
    generateTicketPDF(productosVenta, total) {
        // Crear una nueva instancia de jsPDF
        // Formato pequeño para impresora térmica
        const doc = new jsPDF({
            unit: 'mm',
            format: [80, 200] // Tamaño estándar para tickets térmicos (ancho x alto)
        });

        // Configurar fuente para impresión térmica
        doc.setFont('courier', 'normal');
        doc.setFontSize(10);

        // Margen superior inicial
        let yPos = 10;

        // Añadir el encabezado
        doc.setFontSize(12);
        doc.text('Wendys Ice Cream', 40, yPos, { align: 'center' });
        yPos += 6;

        doc.setFontSize(8);
        doc.text('Romualdo Ruiz Payán SN-C, \n Col del Bosque, 81040 Guasave, Sin.', 40, yPos, { align: 'center' });
        yPos += 8;
        doc.text('Tel: 555-555-5555', 40, yPos, { align: 'center' });
        yPos += 4;

        // Fecha y hora actual
        const fechaActual = new Date();
        const fechaFormateada = fechaActual.toLocaleDateString('es-MX');
        const horaFormateada = fechaActual.toLocaleTimeString('es-MX');
        doc.text(`${fechaFormateada} ${horaFormateada}`, 40, yPos, { align: 'center' });
        yPos += 8;

        // Añadir línea divisoria
        doc.setDrawColor(0);
        doc.setLineWidth(0.1);
        doc.line(10, yPos, 70, yPos);
        yPos += 5;

        // Tabla de productos
        const headers = [['Producto', 'Precio']];
        const rows = productosVenta.map(item => [
            item.producto.nombre,
            this.formatPrice(item.producto.price)
        ]);

        // Verificar si autoTable está disponible
        if (typeof doc.autoTable !== 'function') {
            // Si autoTable no está disponible, crear una alternativa simple
            this.renderSimpleTable(doc, headers, rows, yPos);
            yPos += (rows.length + 1) * 5 + 5; // Estimar posición Y después de la tabla
        } else {
            // Usar autoTable si está disponible
            doc.autoTable({
                startY: yPos,
                head: headers,
                body: rows,
                theme: 'plain',
                styles: {
                    fontSize: 8,
                    cellPadding: 2
                },
                columnStyles: {
                    0: { cellWidth: 50 },
                    1: { cellWidth: 20, halign: 'right' }
                },
                margin: { left: 10, right: 10 }
            });

            // Actualizar la posición Y después de la tabla
            yPos = doc.lastAutoTable.finalY + 5;
        }

        // Línea divisoria
        doc.line(10, yPos, 70, yPos);
        yPos += 5;

        // Total
        doc.setFontSize(10);
        doc.setFont('courier', 'bold');
        doc.text('TOTAL:', 10, yPos);
        doc.text(this.formatPrice(total), 70, yPos, { align: 'right' });
        yPos += 10;

        // Pie de página
        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.text('¡Gracias por su compra!', 40, yPos, { align: 'center' });
        yPos += 4;
        doc.text('Vuelva pronto', 40, yPos, { align: 'center' });

        return doc;
    }

    // Método alternativo para crear una tabla simple sin usar autoTable
    renderSimpleTable(doc, headers, rows, startY) {
        let yPos = startY;
        const cellPadding = 2;
        const fontSize = 8;
        const col1Width = 50;
        const col2Width = 20;
        const margin = 10;

        // Configurar fuente para la tabla
        doc.setFontSize(fontSize);
        doc.setFont('courier', 'bold');

        // Dibujar encabezados
        doc.text(headers[0][0], margin, yPos + cellPadding);
        doc.text(headers[0][1], margin + col1Width + col2Width - 5, yPos + cellPadding, { align: 'right' });
        yPos += 5;

        // Separador después de encabezados
        doc.setLineWidth(0.1);
        doc.line(margin, yPos, 70, yPos);
        yPos += 2;

        // Cambiar a fuente normal para los datos
        doc.setFont('courier', 'normal');

        // Dibujar filas
        rows.forEach(row => {
            doc.text(row[0], margin, yPos + cellPadding);
            doc.text(row[1], margin + col1Width + col2Width - 5, yPos + cellPadding, { align: 'right' });
            yPos += 5;
        });
    }

    formatPrice(price) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    }

    downloadTicket(productosVenta, total) {
        const doc = this.generateTicketPDF(productosVenta, total);

        // Guardar el PDF con un nombre basado en la fecha actual
        const timestamp = new Date().getTime();
        doc.save(`ticket-${timestamp}.pdf`);
    }

    printTicket(productosVenta, total) {
        const doc = this.generateTicketPDF(productosVenta, total);

        // Abrir el PDF en una nueva ventana e imprimir
        if (typeof doc.autoPrint === 'function') {
            doc.autoPrint();
        }
        window.open(doc.output('bloburl'), '_blank');
    }
}

export default new TicketService();