import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FileUploadZoneProps {
  label: string;
  accept: string;
  onFileSelect: (file: File) => void;
  testId?: string;
}

export function FileUploadZone({ label, accept, onFileSelect, testId }: FileUploadZoneProps) {
  const { toast } = useToast();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        if (accept && !file.name.endsWith(accept.replace('*', ''))) {
          toast({
            title: 'Invalid file type',
            description: `Please upload a ${accept} file`,
            variant: 'destructive',
          });
          return;
        }
        onFileSelect(file);
      }
    },
    [accept, onFileSelect, toast]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative"
      data-testid={testId}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        id={`file-upload-${label}`}
      />
      <Card className="border-dashed border-2 border-muted-foreground/25 bg-card/20 hover:border-primary/50 hover:bg-card/40 transition-all cursor-pointer">
        <div className="p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h4 className="text-sm font-semibold mb-1">{label}</h4>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to browse
          </p>
        </div>
      </Card>
    </div>
  );
}
