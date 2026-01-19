---
icon: lucide/layout-grid
---

# Module Registration

The `registerEntityModule` function registers a complete Shopware Administration module with routing, navigation, and settings integration.

## Basic Usage

```javascript
import {
    registerEntityModule,
    registerDetailComponent,
    registerListingComponent
} from '@friendsofshopware/jetpack';

registerEntityModule({
    entity: 'store',
    listingComponent: registerListingComponent({ /* ... */ }),
    detailComponent: registerDetailComponent({ /* ... */ })
});
```

## Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | `string` | Yes | - | The entity name (e.g., `store`, `my_custom_entity`) |
| `listingComponent` | `string` | Yes | - | Component name returned by `registerListingComponent` |
| `detailComponent` | `string` | Yes | - | Component name returned by `registerDetailComponent` |
| `color` | `string` | No | `#9AA8B5` | Module color in hex format |
| `icon` | `string` | No | `regular-envelope` | Icon name from Shopware icon set |
| `showInNavigation` | `boolean` | No | `true` | Show module in main navigation |
| `showInSettings` | `boolean` | No | `false` | Show module in settings |
| `navigationParentModule` | `string` | No | `sw-customer` | Parent module for navigation placement |
| `parentPath` | `string` | No | `sw.settings.index.plugins` | Parent path for settings placement |

## Generated Routes

FroshJetpack automatically generates three routes for your module:

| Route | Path | Description |
|-------|------|-------------|
| `jetpack.{entity}.list` | `/list` | Listing page |
| `jetpack.{entity}.create` | `/create` | Create new entity |
| `jetpack.{entity}.detail` | `/detail/:id` | Edit existing entity |

For an entity named `store`, the routes would be:

- `jetpack.store.list`
- `jetpack.store.create`
- `jetpack.store.detail`

## Navigation Placement

### Main Navigation

To show your module in the main navigation under a specific parent:

```javascript
registerEntityModule({
    entity: 'store',
    showInNavigation: true,
    navigationParentModule: 'sw-catalogue', // Parent module
    // ...
});
```

Common parent modules:

- `sw-catalogue` - Under Catalogues
- `sw-customer` - Under Customers
- `sw-content` - Under Content
- `sw-marketing` - Under Marketing
- `sw-order` - Under Orders

### Settings

To show your module in the settings area:

```javascript
registerEntityModule({
    entity: 'store',
    showInSettings: true,
    showInNavigation: false, // Usually disable main nav when in settings
    parentPath: 'sw.settings.index.plugins', // Settings group
    // ...
});
```

## ACL Privileges

FroshJetpack uses standard Shopware entity privileges:

| Privilege | Used for |
|-----------|----------|
| `{entity}:read` | Viewing list and detail |
| `{entity}:create` | Creating new entities |
| `{entity}:update` | Updating entities |
| `{entity}:delete` | Deleting entities |

For an entity named `store`:

- `store:read`
- `store:create`
- `store:update`
- `store:delete`

## Example: Full Configuration

```javascript
registerEntityModule({
    entity: 'store',
    color: '#ff6b6b',
    icon: 'regular-store',
    showInNavigation: true,
    showInSettings: true,
    navigationParentModule: 'sw-catalogue',
    parentPath: 'sw.settings.index.plugins',
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
