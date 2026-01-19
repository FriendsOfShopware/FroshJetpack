# @friendsofshopware/jetpack

A rapid development framework for Shopware 6 Administration modules. Build complete CRUD interfaces for your entities with minimal code.

## Installation

```bash
npm install @friendsofshopware/jetpack
```

## Quick Start

Given a Shopware entity:

```php
#[AutoconfigureTag('shopware.entity')]
#[\Shopware\Core\Framework\DataAbstractionLayer\Attribute\Entity('store')]
class StoreEntity extends Entity
{
    #[PrimaryKey]
    #[Field(type: FieldType::UUID)]
    public string $id;

    #[Field(type: FieldType::STRING, translated: true)]
    public ?string $name = null;

    #[Translations]
    public ?array $translations = null;
}
```

Create a complete Administration module:

```javascript
import {
    registerEntityModule,
    registerDetailComponent,
    registerListingComponent
} from '@friendsofshopware/jetpack';

registerEntityModule({
    entity: 'store',
    showInSettings: true,
    listingComponent: registerListingComponent({
        entity: 'store',
        columns: {
            name: { linkToDetail: true }
        }
    }),
    detailComponent: registerDetailComponent({
        entity: 'store',
        cards: [{
            name: 'general',
            fields: {
                name: { type: 'text' }
            }
        }]
    })
});
```

## Features

- **Declarative Configuration** - Define modules with simple configuration objects
- **Automatic Listing Pages** - Sorting, pagination, and language switching out of the box
- **Automatic Detail Pages** - Form validation and error handling included
- **Translation Support** - Built-in support for translatable entities
- **Type-Safe** - Full TypeScript support with comprehensive type definitions

## Documentation

For full documentation, visit our [documentation site](https://friendsofshopware.github.io/jetpack/).

### API Reference

#### `registerEntityModule(options)`

Registers a complete Administration module with routing and navigation.

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | `string` | Yes | - | Entity name |
| `listingComponent` | `string` | Yes | - | Component from `registerListingComponent` |
| `detailComponent` | `string` | Yes | - | Component from `registerDetailComponent` |
| `color` | `string` | No | `#9AA8B5` | Module color |
| `icon` | `string` | No | `regular-envelope` | Module icon |
| `showInNavigation` | `boolean` | No | `true` | Show in main navigation |
| `showInSettings` | `boolean` | No | `false` | Show in settings |
| `navigationParentModule` | `string` | No | `sw-customer` | Parent module for navigation |

#### `registerListingComponent(options)`

Creates a listing page component.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `entity` | `string` | Yes | Entity name |
| `columns` | `Record<string, ColumnOptions>` | Yes | Column configuration |
| `showSearchBar` | `boolean` | No | Show search bar |

**Column Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `linkToDetail` | `boolean` | `false` | Link to detail page |
| `sortable` | `boolean` | `true` | Allow sorting |
| `width` | `string` | `'auto'` | Column width |
| `align` | `'left' \| 'right'` | `'left'` | Text alignment |
| `visible` | `boolean` | `true` | Column visibility |
| `inlineEdit` | `'string' \| 'number'` | - | Enable inline editing |

#### `registerDetailComponent(options)`

Creates a detail/create page component.

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `entity` | `string` | Yes | Entity name |
| `cards` | `CardOptions[]` | Yes | Card configuration |
| `labelProperty` | `string` | No | Property for entity description (default: `'name'`) |

**Field Types:**

- `text` - Single-line text input
- `textarea` - Multi-line text input
- `number` - Numeric input
- `checkbox` - Boolean checkbox
- `password` - Password input
- `url` - URL input
- `select` - Single select dropdown
- `multi-select` - Multiple select dropdown

## Snippets

Jetpack uses translation keys for all labels. Create snippet files with this structure:

```json
{
    "jetpack-store": {
        "title": "Stores",
        "list": {
            "actions": { "create": "Create store", "edit": "Edit" },
            "columns": { "name": "Name" }
        },
        "detail": {
            "actions": { "save": "Save" },
            "cards": {
                "general": {
                    "title": "General",
                    "fields": { "name": "Name" }
                }
            }
        }
    }
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
