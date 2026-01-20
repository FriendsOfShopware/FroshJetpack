---
icon: lucide/list
---

# Listing Component

The `registerListingComponent` function creates a listing page for your entity with sorting, pagination, and language switching support.

## Basic Usage

```javascript
import { registerListingComponent } from '@friendsofshopware/jetpack';

const listingComponent = registerListingComponent({
    entity: 'store',
    columns: {
        name: {
            linkToDetail: true
        }
    }
});
```

## Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | `string` | Yes | - | The entity name |
| `columns` | `Record<string, ColumnOptions>` | Yes | - | Column configuration (must have at least one) |
| `showSearchBar` | `boolean` | No | `false` | Show search bar |

## Column Options

Each column is defined by its field name as key and configuration object as value:

```javascript
columns: {
    fieldName: {
        // options
    }
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `linkToDetail` | `boolean` | `false` | Make column value a link to detail page |
| `sortable` | `boolean` | `true` | Allow sorting by this column |
| `visible` | `boolean` | `true` | Column visibility |
| `width` | `string` | `'auto'` | Column width (e.g., `'200px'`, `'20%'`) |
| `align` | `'left' \| 'right'` | `'left'` | Text alignment |
| `allowResize` | `boolean` | `true` | Allow column resizing |
| `naturalSorting` | `boolean` | `false` | Use natural sorting (for strings with numbers) |
| `inlineEdit` | `'string' \| 'number'` | `null` | Enable inline editing |

## Translation Keys

Column labels are resolved from translation keys:

```
{moduleName}.list.columns.{columnName}
```

For entity `store` with column `name`:

```
jetpack-store.list.columns.name
```

### Required Snippet Structure

```json
{
    "jetpack-store": {
        "list": {
            "actions": {
                "create": "Create store",
                "edit": "Edit"
            },
            "columns": {
                "name": "Name",
                "active": "Active",
                "createdAt": "Created"
            }
        }
    }
}
```

## Language Switching

For translatable entities, FroshJetpack automatically:

- Detects if the entity has translations
- Shows a language switch in the toolbar
- Reloads the list when language changes

## Examples

### Multiple Columns

```javascript
registerListingComponent({
    entity: 'store',
    columns: {
        name: {
            linkToDetail: true,
            width: '300px'
        },
        active: {
            width: '100px',
            align: 'center'
        },
        createdAt: {
            sortable: true,
            width: '150px'
        }
    }
});
```

### With Search Bar

```javascript
registerListingComponent({
    entity: 'store',
    showSearchBar: true,
    columns: {
        name: {
            linkToDetail: true
        }
    }
});
```

### Inline Editing

```javascript
registerListingComponent({
    entity: 'store',
    columns: {
        name: {
            linkToDetail: true,
            inlineEdit: 'string'
        },
        position: {
            inlineEdit: 'number'
        }
    }
});
```

### Non-Sortable Columns

```javascript
registerListingComponent({
    entity: 'store',
    columns: {
        name: {
            linkToDetail: true
        },
        description: {
            sortable: false  // Disable sorting for this column
        }
    }
});
```
