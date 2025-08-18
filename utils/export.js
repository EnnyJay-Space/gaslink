import Papa from 'papaparse'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export function exportToCSV(data, filename = 'export.csv') {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToPDF(data, columns, filename = 'report.pdf') {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [columns],
    body: data.map(row => columns.map(col => row[col])),
  })
  doc.save(filename)
}
