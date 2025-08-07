import * as XLSX from 'xlsx';
import type { BrewRecord } from '@/types/brew';

// Export functions
export const exportToJSON = (brews: BrewRecord[]): void => {
  const dataStr = JSON.stringify(brews, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `coffee-brews-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const exportToCSV = (brews: BrewRecord[]): void => {
  if (brews.length === 0) return;
  
  const headers = Object.keys(brews[0]).join(',');
  const csvContent = [
    headers,
    ...brews.map(brew => 
      Object.values(brew).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `coffee-brews-${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToExcel = (brews: BrewRecord[]): void => {
  const worksheet = XLSX.utils.json_to_sheet(brews);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Coffee Brews');
  
  const fileName = `coffee-brews-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Import functions
export const importFromJSON = (file: File): Promise<BrewRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result) as BrewRecord[];
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const importFromCSV = (file: File): Promise<BrewRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const lines = result.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
        
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(v => v.replace(/"/g, ''));
          const obj: any = {};
          headers.forEach((header, index) => {
            const value = values[index];
            // Convert numeric fields
            if (['dose', 'water', 'grind', 'timeSec', 'bloomAtSec', 'rating'].includes(header)) {
              obj[header] = value ? parseFloat(value) : undefined;
            } else {
              obj[header] = value || undefined;
            }
          });
          return obj as BrewRecord;
        });
        
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid CSV file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const importFromExcel = (file: File): Promise<BrewRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as BrewRecord[];
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid Excel file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};