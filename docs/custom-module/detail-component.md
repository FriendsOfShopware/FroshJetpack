---
icon: lucide/file-edit
---

# Detail Component

The `registerDetailComponent` function creates a detail/create page for your entity with form fields organized in cards.

## Basic Usage

```javascript
import { registerDetailComponent } from '@friendsofshopware/jetpack';

const detailComponent = registerDetailComponent({
    entity: 'store',
    cards: [
        {
            name: 'general',
            fields: {
                name: {
                    type: 'text'
                }
            }
        }
    ]
});
```

## Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `entity` | `string` | Yes | - | The entity name |
| `cards` | `CardOptions[]` | Yes | - | Array of card configurations (must have at least one) |
| `labelProperty` | `string` | No | `'name'` | Property used for entity description in language info |

## Card Options

Each card groups related fields together:

```javascript
{
    name: 'general',  // Required: unique identifier for the card
    fields: {
        // field configurations
    }
}
```

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `name` | `string` | Yes | Unique card identifier (used for translation keys) |
| `fields` | `Record<string, FieldOptions>` | Yes | Field configurations |

## Field Types

FroshJetpack supports the following field types:

| Type | Component | Description |
|------|-----------|-------------|
| `text` | `sw-text-field` | Single-line text input |
| `textarea` | `sw-textarea-field` | Multi-line text input |
| `number` | `sw-number-field` | Numeric input |
| `checkbox` | `sw-checkbox-field` | Boolean checkbox |
| `password` | `sw-password-field` | Password input |
| `url` | `sw-url-field` | URL input with validation |
| `select` | `mt-select` | Single select dropdown |
| `multi-select` | `sw-multi-select` | Multiple select dropdown |

## Field Options

| Option | Type | Applies to | Description |
|--------|------|------------|-------------|
| `type` | `InputType` | All | Field type (required) |
| `placeholder` | `string` | All | Placeholder text |
| `helpText` | `string` | All | Help text below the field |
| `options` | `Record<string, string>` | `select`, `multi-select` | Key-value pairs for options |

## Translation Keys

### Card Titles

```
{moduleName}.detail.cards.{cardName}.title
```

### Field Labels

```
{moduleName}.detail.cards.{cardName}.fields.{fieldName}
```

### Required Snippet Structure

```json
{
    "jetpack-store": {
        "detail": {
            "actions": {
                "save": "Save"
            },
            "cards": {
                "general": {
                    "title": "General Settings",
                    "fields": {
                        "name": "Name",
                        "description": "Description",
                        "active": "Active"
                    }
                },
                "contact": {
                    "title": "Contact Information",
                    "fields": {
                        "email": "Email",
                        "phone": "Phone"
                    }
                }
            }
        }
    }
}
```

## Language Switching

For translatable entities, FroshJetpack automatically:

- Detects if the entity has translations
- Shows a language switch in the toolbar (only when editing, not creating)
- Shows language inheritance info banner
- Displays default language values as placeholders
- Prompts to save before switching languages if there are unsaved changes
- Resets to default language when creating new entities

## Examples

### Multiple Cards

```javascript
registerDetailComponent({
    entity: 'store',
    cards: [
        {
            name: 'general',
            fields: {
                name: { type: 'text' },
                description: { type: 'textarea' },
                active: { type: 'checkbox' }
            }
        },
        {
            name: 'contact',
            fields: {
                email: { type: 'text' },
                phone: { type: 'text' },
                website: { type: 'url' }
            }
        }
    ]
});
```

### With Select Fields

```javascript
registerDetailComponent({
    entity: 'store',
    cards: [
        {
            name: 'general',
            fields: {
                name: { type: 'text' },
                status: {
                    type: 'select',
                    options: {
                        'jetpack-store.status.active': 'active',
                        'jetpack-store.status.inactive': 'inactive',
                        'jetpack-store.status.pending': 'pending'
                    }
                }
            }
        }
    ]
});
```

!!! note "Select Options"
    The keys in the `options` object are translation snippet keys. The values are the actual values stored in the database.

### With Help Text

```javascript
registerDetailComponent({
    entity: 'store',
    cards: [
        {
            name: 'general',
            fields: {
                name: {
                    type: 'text',
                    helpText: 'Enter a unique store name'
                },
                apiKey: {
                    type: 'password',
                    helpText: 'Your API key for external integrations'
                }
            }
        }
    ]
});
```

### Custom Label Property

By default, FroshJetpack uses the `name` property to display the entity description in the language info banner. You can customize this:

```javascript
registerDetailComponent({
    entity: 'store',
    labelProperty: 'title',  // Use 'title' instead of 'name'
    cards: [
        {
            name: 'general',
            fields: {
                title: { type: 'text' }
            }
        }
    ]
});
```

## Form Validation

FroshJetpack automatically handles validation for required fields defined in your entity definition. Error messages are displayed below the respective fields.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save the entity |
