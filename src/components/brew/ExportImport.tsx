import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Download, Upload } from "lucide-react";
import { exportToJSON, exportToCSV, exportToExcel, importFromJSON, importFromCSV, importFromExcel } from "@/utils/exportImport";
import type { BrewRecord } from "@/types/brew";

interface ExportImportProps {
  brews: BrewRecord[];
  onImport: (brews: BrewRecord[]) => void;
}

export const ExportImport = ({ brews, onImport }: ExportImportProps) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'excel'>('json');
  const [importFormat, setImportFormat] = useState<'json' | 'csv' | 'excel'>('json');

  const handleExport = () => {
    if (brews.length === 0) {
      toast({ title: "No data", description: "No brews to export." });
      return;
    }

    try {
      switch (exportFormat) {
        case 'json':
          exportToJSON(brews);
          break;
        case 'csv':
          exportToCSV(brews);
          break;
        case 'excel':
          exportToExcel(brews);
          break;
      }
      toast({ title: "Export successful", description: `Exported ${brews.length} brews to ${exportFormat.toUpperCase()}.` });
    } catch (error) {
      toast({ title: "Export failed", description: "Failed to export data." });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      let importedBrews: BrewRecord[];
      
      switch (importFormat) {
        case 'json':
          importedBrews = await importFromJSON(file);
          break;
        case 'csv':
          importedBrews = await importFromCSV(file);
          break;
        case 'excel':
          importedBrews = await importFromExcel(file);
          break;
        default:
          throw new Error('Unsupported format');
      }

      onImport(importedBrews);
      toast({ title: "Import successful", description: `Imported ${importedBrews.length} brews.` });
    } catch (error) {
      toast({ title: "Import failed", description: error instanceof Error ? error.message : "Failed to import data." });
    }

    // Reset file input
    event.target.value = '';
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Export & Import Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Section */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as typeof exportFormat)}>
                <SelectTrigger id="export-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleExport} className="w-full" disabled={brews.length === 0}>
              <Download className="size-4" />
              Export Data
            </Button>
          </div>

          {/* Import Section */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="import-format">Import Format</Label>
              <Select value={importFormat} onValueChange={(v) => setImportFormat(v as typeof importFormat)}>
                <SelectTrigger id="import-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="import-file">Select File</Label>
              <Input
                id="import-file"
                type="file"
                accept={
                  importFormat === 'json' ? '.json' :
                  importFormat === 'csv' ? '.csv' :
                  '.xlsx,.xls'
                }
                onChange={handleImport}
              />
            </div>
            <Button variant="outline" className="w-full" onClick={() => document.getElementById('import-file')?.click()}>
              <Upload className="size-4" />
              Import Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};