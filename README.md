# BigCommerce CLI (bc-cli)

`bc-cli` is a Node.js CLI based on Yargs to interact with BigCommerce API. 

![BigCommerce CLI](./docs/bc-cli-table.png)

## Features

For now it's only requesting data through the Catalog REST API for the following entities:

- Category Trees (get, get-all, export as JSON files)
- Categories (get-all, export as JSON files)
- Brands (get-all)
- Products (get, get-all, export as JSON files)
- Variants (for a single product, get-all, export as JSON files)

The tool can display or save data as table (default), CSV or JSON.

## Usage

### Sample commands

```
bc-cli catalog category-trees get-all
bc-cli catalog category-trees get-all --csv
bc-cli catalog category-trees get-all --json
bc-cli catalog categories get-all --extra-fields sort_order --query tree_id:in=3 name:like=Sneakers
bc-cli catalog categories get-all --extra-fields sort_order --query tree_id:in=3 name:like=Dress
bc-cli catalog products get-all --query brand_id:in=40
bc-cli catalog products get-all --query name:like=Dress --follow-id
```

### General options

```
Usage: bc-cli <command> [options]

Commands:
  bc-cli catalog  Catalog commands

Options:
      --storeHash    Store Hash                 [string] [default: "XXX"]
      --accessToken  accessToken                [string] [default: "XXX"]
  -v, --version      Show version number                               [boolean]
  -h, --help         Show help                                         [boolean]
```

### Catalog commands

```
Catalog commands

Commands:
  bc-cli catalog brands          Brands commands
  bc-cli catalog categories      Category commands
  bc-cli catalog category-trees  Category Trees commands
  bc-cli catalog products        Products commands
  bc-cli catalog variants        Variants commands
```
### Brands commands

```
Brands commands

Commands:
  bc-cli catalog brands get-all  Get all Brands
```

#### get-all options

```
      --query         Add query parameters                 [array] [default: []]
      --extra-fields  Retrieve additional fields           [array] [default: []]
      --file          Output as JSON file                               [string]
      --json          Output as JSON                                   [boolean]
      --csv           Output as CSV                                    [boolean]
```

### Categories commands

```
Categories commands

Commands:
  bc-cli catalog categories export  <folder>  Export all Categories
  bc-cli catalog categories get-all           Get all Categories
```

#### export options

```
      --query        Add query parameters                  [array] [default: []]
```

#### get-all options

```
      --follow-id     Get entities name from id                        [boolean]
      --query         Add query parameters                 [array] [default: []]
      --extra-fields  Retrieve additional fields           [array] [default: []]
      --file          Output as JSON file                               [string]
      --json          Output as JSON                                   [boolean]
      --csv           Output as CSV                                    [boolean]
```

### Category Trees commands

```
Category Trees commands

Commands:
  bc-cli catalog category-trees export <folder>  Export all Category Trees
  bc-cli catalog category-trees get-all          Get all Category Trees
  bc-cli catalog category-trees get <tree-id>    Get a Category Tree
```

#### get-all options

```
      --file         Output as JSON file                                [string]
      --json         Output as JSON                                    [boolean]
      --csv          Output as CSV                                     [boolean]
```

#### get options

```
      --extra-fields  Retrieve additional fields           [array] [default: []]
      --top-level     Get only Top Level Categories                    [boolean]
      --file          Output as file                               [string]
      --json          Output as JSON                                   [boolean]
      --flatten       Flatten JSON structure                           [boolean]
      --no_parent_id  Remove Parent ID from JSON entries               [boolean]
      --csv           Output as CSV                                    [boolean]
```

### Products commands

```
Products commands

Commands:
  bc-cli catalog products export <folder>   Export all Products
  bc-cli catalog products get-all           Get all Products
  bc-cli catalog products get <product-id>  Get single Product
```

#### export options

```
      --include-variants  Include variants                             [boolean]
      --query             Add query parameters             [array] [default: []]
```

### get-all options

```
      --follow-id     Get entities name from id                        [boolean]
      --query         Add query parameters                 [array] [default: []]
      --extra-fields  Retrieve additional fields           [array] [default: []]
      --file          Output as JSON file                               [string]
      --json          Output as JSON                                   [boolean]
      --csv           Output as CSV                                    [boolean]
```

#### get options

```
      --follow-id     Get entities name from id                        [boolean]
      --extra-fields  Retrieve additional fields           [array] [default: []]
      --file          Output as JSON file                               [string]
      --json          Output as JSON                                   [boolean]
      --csv           Output as CSV                                    [boolean]
```

### Variants commands (for a single product)

```
Variants commands

Commands:
  bc-cli catalog variants export            Export all Variants for a Product <product-id> <folder>
  bc-cli catalog variants get-all           Get all Product Variants <product-id>
```

#### export options

```
      --query        Add query parameters                  [array] [default: []]
```

#### get-all options

```
      --query         Add query parameters                 [array] [default: []]
      --extra-fields  Retrieve additional fields           [array] [default: []]
      --file          Output as JSON file                               [string]
      --json          Output as JSON                                   [boolean]
      --csv           Output as CSV                                    [boolean]
```
