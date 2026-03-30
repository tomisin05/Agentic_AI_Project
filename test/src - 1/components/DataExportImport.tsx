import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Download, Upload, FileText, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from "motion/react";

interface JournalEntry {
  id: string;
  date: string;
  sessionNumber: number;
  focusRating: number;
  mood: string;
  reflection: string;
  storyOutcome: string;
  storyChapter: string;
}

interface DataExportImportProps {
  entries: JournalEntry[];
  onImport: (entries: JournalEntry[]) => void;
}

export function DataExportImport({ entries, onImport }: DataExportImportProps) {
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');

  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      entries: entries
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storystudy-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Session Number', 'Focus Rating', 'Mood', 'Reflection', 'Story Chapter'];
    const csvContent = [
      headers.join(','),
      ...entries.map(entry => [
        new Date(entry.date).toLocaleDateString(),
        entry.sessionNumber,
        entry.focusRating,
        `"${entry.mood.replace(/"/g, '""')}"`,
        `"${entry.reflection.replace(/"/g, '""')}"`,
        `"${entry.storyChapter.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `storystudy-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importedEntries: JournalEntry[];

        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          const data = JSON.parse(content);
          importedEntries = data.entries || data; // Support both wrapped and unwrapped formats
        } else if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          // Parse CSV
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          
          importedEntries = lines.slice(1)
            .filter(line => line.trim())
            .map((line, index) => {
              const values = line.split(',').map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
              return {
                id: `imported-${Date.now()}-${index}`,
                date: new Date(values[0]).toISOString(),
                sessionNumber: parseInt(values[1]) || 0,
                focusRating: parseInt(values[2]) || 3,
                mood: values[3] || 'neutral',
                reflection: values[4] || '',
                storyOutcome: '',
                storyChapter: values[5] || 'Chapter 1'
              };
            });
        } else {
          throw new Error('Unsupported file format. Please use JSON or CSV files.');
        }

        // Validate imported data
        if (!Array.isArray(importedEntries)) {
          throw new Error('Invalid data format');
        }

        // Ensure all entries have required fields
        const validEntries = importedEntries.filter(entry => 
          entry.id && entry.date && typeof entry.focusRating === 'number'
        );

        if (validEntries.length === 0) {
          throw new Error('No valid entries found in the file');
        }

        onImport(validEntries);
        setImportStatus('success');
        setImportMessage(`Successfully imported ${validEntries.length} entries`);
        
        // Reset file input
        event.target.value = '';
        
      } catch (error) {
        setImportStatus('error');
        setImportMessage(error instanceof Error ? error.message : 'Failed to import data');
      }
    };

    reader.readAsText(file);
  };

  const generateSampleData = () => {
    const sampleEntries: JournalEntry[] = [
      {
        id: 'sample-1',
        date: new Date().toISOString(),
        sessionNumber: 1,
        focusRating: 4,
        mood: 'focused',
        reflection: 'Great study session today!',
        storyOutcome: 'The hero strikes a powerful blow against the dragon!',
        storyChapter: 'Chapter 1: The Dragon Awakens'
      },
      {
        id: 'sample-2',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        sessionNumber: 2,
        focusRating: 3,
        mood: 'determined',
        reflection: 'Had some distractions but pushed through.',
        storyOutcome: 'The battle continues with renewed determination.',
        storyChapter: 'Chapter 1: The Dragon Awakens'
      }
    ];

    onImport(sampleEntries);
    setImportStatus('success');
    setImportMessage('Sample data imported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-500" />
            Export Your Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download your study data for backup or analysis. Choose your preferred format.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={exportToJSON}
                className="w-full justify-start"
                variant="outline"
                disabled={entries.length === 0}
              >
                <Database className="w-4 h-4 mr-2" />
                Export as JSON
                <span className="ml-auto text-xs text-muted-foreground">
                  {entries.length} entries
                </span>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={exportToCSV}
                className="w-full justify-start"
                variant="outline"
                disabled={entries.length === 0}
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as CSV
                <span className="ml-auto text-xs text-muted-foreground">
                  Spreadsheet
                </span>
              </Button>
            </motion.div>
          </div>

          {entries.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Complete some study sessions first to have data to export.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-500" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import previously exported data or restore from backup. Supports JSON and CSV formats.
          </p>

          <div className="space-y-3">
            <div>
              <Label htmlFor="import-file">Choose File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json,.csv"
                onChange={handleFileImport}
                className="mt-1"
              />
            </div>

            {importStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert variant={importStatus === 'success' ? 'default' : 'destructive'}>
                  {importStatus === 'success' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{importMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Don't have data to import? Try our sample data:
              </p>
              <Button variant="outline" size="sm" onClick={generateSampleData}>
                Load Sample Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-medium">{entries.length}</p>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
            </div>
            <div>
              <p className="text-2xl font-medium">
                {entries.length > 0 ? new Date(Math.min(...entries.map(e => new Date(e.date).getTime()))).toLocaleDateString() : '-'}
              </p>
              <p className="text-sm text-muted-foreground">First Session</p>
            </div>
            <div>
              <p className="text-2xl font-medium">
                {entries.length > 0 ? new Date(Math.max(...entries.map(e => new Date(e.date).getTime()))).toLocaleDateString() : '-'}
              </p>
              <p className="text-sm text-muted-foreground">Latest Session</p>
            </div>
            <div>
              <p className="text-2xl font-medium">
                {entries.length > 0 ? Math.round((entries.reduce((sum, e) => sum + e.focusRating, 0) / entries.length) * 10) / 10 : '-'}
              </p>
              <p className="text-sm text-muted-foreground">Avg Focus</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}