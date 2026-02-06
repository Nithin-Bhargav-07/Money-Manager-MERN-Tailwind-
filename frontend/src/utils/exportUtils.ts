import { Transaction } from '../components/transactions/TransactionTable';


export const exportToCSV = (transactions: Transaction[], filename = 'transactions') => {
  if (transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  const headers = ['Date', 'Type', 'Description', 'Category', 'Division', 'Amount', 'Related Account'];
  
  const rows = transactions.map((tx) => [
    new Date(tx.date).toLocaleDateString(),
    tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
    tx.description || '-',
    tx.category,
    tx.division || (tx.type === 'expense' ? '-' : '—'),
    tx.amount.toString(),
    tx.relatedAccount || '-',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
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
};

export const exportToPDF = async (transactions: Transaction[], filename = 'transactions') => {
  if (transactions.length === 0) {
    alert('No transactions to export');
    return;
  }

  try {
    const { jsPDF } = await import('jspdf');
    await import('jspdf-autotable');

    const doc = new jsPDF();
    
    // 1. Header Info
    doc.setFontSize(18);
    doc.text('Transaction Report', 14, 20);
    
    doc.setFontSize(10);
    const dateRange = transactions.length > 0
      ? `${new Date(transactions[transactions.length - 1].date).toLocaleDateString()} - ${new Date(transactions[0].date).toLocaleDateString()}`
      : new Date().toLocaleDateString();
    
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Date Range: ${dateRange}`, 14, 34);

    const tableData = transactions.map((tx) => [
      new Date(tx.date).toLocaleDateString(),
      tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
      tx.description || '-',
      tx.category,
      tx.division || (tx.type === 'expense' ? '-' : '—'),
      `Rs. ${tx.amount.toLocaleString()}`, 
      tx.relatedAccount || '-',
    ]);

    (doc as any).autoTable({
      head: [['Date', 'Type', 'Desc', 'Category', 'Division', 'Amount', 'Account']],
      body: tableData,
      startY: 40,
      styles: { 
        fontSize: 9, 
        cellPadding: 2,
        overflow: 'linebreak' 
      },
      headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        0: { cellWidth: 22 }, 
        1: { cellWidth: 18 }, 
        2: { cellWidth: 35 }, 
        3: { cellWidth: 25 }, 
        4: { cellWidth: 20 }, 
        5: { cellWidth: 30, halign: 'right' }, 
        6: { cellWidth: 25 }  
      }
    });

    const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    const finalY = (doc as any).lastAutoTable.finalY || 40;

    (doc as any).autoTable({
      startY: finalY + 10,
      head: [['Summary', 'Value']],
      body: [
        ['Total Income', `Rs. ${income.toLocaleString()}`],
        ['Total Expense', `Rs. ${expense.toLocaleString()}`],
        ['Balance', `Rs. ${balance.toLocaleString()}`],
      ],
      theme: 'grid',
      styles: { 
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: { fillColor: [50, 50, 50], textColor: 255 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 }, 
        1: { halign: 'right', cellWidth: 40 }
      },
      tableWidth: 80, 
      margin: { left: 14 } 
    });

    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please make sure jspdf is installed.');
  }
};