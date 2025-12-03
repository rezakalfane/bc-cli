/**
 * Generate CSV output from header and values
 * @param header List of header titles
 * @param values List of values
 * @returns CSV output
 */
export const generateCsv = (header: string[], values: string[][]) => {
    let finalOutput = ""
    if (header) {
        finalOutput += header
            .map(item => `"${item.toString().replace('"', '""')}"`)
            .join(",")
        finalOutput += "\n"
    }
    values.forEach(value => {
        finalOutput += value
            .map(item => `"${item?.toString().replace('"', '""')}"`)
            .join(",")
        finalOutput += "\n"
    })
    return finalOutput
}

/**
 * Generate TSV output from header and values
 * @param header List of header titles
 * @param values List of values
 * @returns TSV output
 */
export const generateTsv = (header: string[], values: string[][]) => {
    let finalOutput = ""
    if (header) {
        finalOutput += header
            .map(item => item.toString().replace(/\t/g, ' '))
            .join("\t")
        finalOutput += "\n"
    }
    values.forEach(value => {
        finalOutput += value
            .map(item => item?.toString().replace(/\t/g, ' '))
            .join("\t")
        finalOutput += "\n"
    })
    return finalOutput
}

/**
 * Parse CSV content into an array of objects
 * @param csvContent CSV file content as string
 * @returns Array of objects with CSV data
 */
export const parseCsv = (csvContent: string): any[] => {
    const lines = csvContent.trim().split('\n');
    if (lines.length === 0) {
        return [];
    }

    // Parse header row
    const headers = parseCsvLine(lines[0]);

    // Parse data rows
    const data: any[] = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        if (values.length === headers.length) {
            const row: any = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            data.push(row);
        }
    }

    return data;
}

/**
 * Parse a single CSV line handling quoted values
 * @param line CSV line to parse
 * @returns Array of values
 */
const parseCsvLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++;
            } else {
                // Toggle quote mode
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of value
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    // Add the last value
    values.push(current);

    return values;
}