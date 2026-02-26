export interface CsvRow {
  [key: string]: string;
}

export interface CsvParseResult {
  rows: CsvRow[];
  errors: string[];
}

export function parseCsv(content: string): CsvParseResult {
  const errors: string[] = [];
  const rows: CsvRow[] = [];

  try {
    const lines = content.split('\n').filter((line) => line.trim());
    if (lines.length === 0) {
      errors.push('CSV file is empty');
      return { rows, errors };
    }

    const headers = parseCSVLine(lines[0]);
    if (headers.length === 0) {
      errors.push('CSV headers are missing');
      return { rows, errors };
    }

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === 0) continue;

      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const row: CsvRow = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index].trim();
      });
      rows.push(row);
    }
  } catch (error) {
    errors.push(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { rows, errors };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
