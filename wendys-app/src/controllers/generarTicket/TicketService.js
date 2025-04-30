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
        doc.text('Mi Tienda', 40, yPos, { align: 'center' });
        yPos += 6;

        doc.setFontSize(8);
        doc.text('Dirección de la Tienda', 40, yPos, { align: 'center' });
        yPos += 4;
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
            item.producto.name,
            this.formatPrice(item.producto.price)
        ]);

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
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }
}

export default new TicketService();