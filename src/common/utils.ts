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