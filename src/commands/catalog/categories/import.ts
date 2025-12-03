import { BCClient, BCClientCredentials } from "../../../bigcommerce/bc-client"
import { Argv } from "yargs"
import { readFileSync } from "fs";
import { parseCsv } from "../../../common/utils";
import chalk from "chalk";

export const command = 'import <file>'
export const describe = 'Import categories from CSV file'
export const builder = function (yargs: Argv) {
    return yargs
        .positional("file", {
            type: "string",
            describe: "Input CSV file path"
        })
        .demandOption(["file"], "Please provide input CSV file path")
}

export const handler = async function (argv: any) {
    try {
        const credentials: BCClientCredentials = {
            storeHash: argv.storeHash,
            accessToken: argv.accessToken
        }
        const bcClient = new BCClient(credentials)

        // Read and parse CSV file
        console.log(chalk.blue(`Reading CSV file: ${argv.file}`))
        const csvContent = readFileSync(argv.file, 'utf-8')
        const csvData = parseCsv(csvContent)

        if (csvData.length === 0) {
            console.log(chalk.yellow('No data found in CSV file'))
            return
        }

        console.log(chalk.blue(`Found ${csvData.length} categories to import`))

        // Step 1: Create all categories without parent_id
        console.log(chalk.blue('\nStep 1: Creating categories without parent relationships...'))

        const categoriesToCreate = csvData.map(row => {
            const category: any = {
                name: row.name,
                tree_id: parseInt(row.tree_id),
                is_visible: row.is_visible.toLowerCase() === 'true',
                url: {
                    path: row.url,
                    is_customized: false
                }
            }
            return category
        })

        let createdCategories: any[] = []
        try {
            createdCategories = await bcClient.createCategories(categoriesToCreate)
            console.log(chalk.green(`✓ Successfully created ${createdCategories.length} categories`))
        } catch (error: any) {
            console.error(chalk.red(`✗ Failed to create categories: ${error.message}`))
            throw error
        }

        // Step 2: Update categories with parent_id relationships
        console.log(chalk.blue('\nStep 2: Updating parent relationships...'))

        // Create a mapping of original CSV data to created categories
        const pathToCategoryMap = new Map()
        createdCategories.forEach((category, index) => {
            const originalRow = csvData[index]
            pathToCategoryMap.set(originalRow.url, {
                category_id: category.category_id,
                original_parent_id: originalRow.parent_id,
                createdCategory: category
            })
        })

        // Build a map of CSV parent_id to BigCommerce category_id
        const csvIdToPathMap = new Map()
        csvData.forEach(row => {
            csvIdToPathMap.set(row.category_id, row.url)
        })

        // Prepare bulk update array
        const categoriesToUpdate: any[] = []
        let skippedCount = 0

        for (const [path, categoryInfo] of pathToCategoryMap) {
            const originalParentId = categoryInfo.original_parent_id

            // Skip if parent_id is 0 (top-level category)
            if (originalParentId === '0' || originalParentId === 0) {
                skippedCount++
                continue
            }

            // Find the parent's path from the CSV data
            const parentPath = csvIdToPathMap.get(originalParentId)

            if (!parentPath) {
                console.log(chalk.yellow(`⚠ Warning: Could not find parent with CSV ID ${originalParentId} for category at ${path}`))
                skippedCount++
                continue
            }

            // Find the parent's BigCommerce category_id
            const parentInfo = pathToCategoryMap.get(parentPath)

            if (!parentInfo) {
                console.log(chalk.yellow(`⚠ Warning: Could not find created parent category for path ${parentPath}`))
                skippedCount++
                continue
            }

            // Add to bulk update array
            categoriesToUpdate.push({
                ...categoryInfo.createdCategory,
                parent_id: parentInfo.category_id
            })
        }

        // Perform bulk update if there are categories to update
        let updatedCount = 0
        if (categoriesToUpdate.length > 0) {
            try {
                const updatedCategories = await bcClient.updateCategories(categoriesToUpdate)
                // Use the response length if available, otherwise use the request count
                updatedCount = (updatedCategories && updatedCategories.length) || categoriesToUpdate.length
                console.log(chalk.green(`✓ Successfully updated ${updatedCount} categories with parent relationships`))
            } catch (error: any) {
                console.error(chalk.red(`✗ Failed to update categories: ${error.message}`))
            }
        } else {
            console.log(chalk.yellow('No categories require parent relationship updates'))
        }

        console.log(chalk.green(`\n✓ Import complete!`))
        console.log(chalk.blue(`  Created: ${createdCategories.length} categories`))
        console.log(chalk.blue(`  Updated: ${updatedCount} with parent relationships`))
        console.log(chalk.blue(`  Skipped: ${skippedCount} (top-level or missing parents)`))

    } catch (error: any) {
        console.error(chalk.red(`\n✗ Import failed: ${error.message}`))
        process.exit(1)
    }
}
