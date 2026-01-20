---
icon: lucide/rocket
---

# Getting Started

<p align="center">
  <img src="assets/logo.png" alt="FroshJetpack Logo">
</p>


Jetpack is a library that simplifies building Shopware 6 Administration modules. Instead of writing boilerplate Vue components, templates, and routing configuration, you can declaratively define your entity modules with a simple configuration object.

## Features

- Declarative entity module registration
- Automatic listing page with sorting, pagination, and language switching
- Automatic detail/create page with form validation
- Built-in translation support for translatable entities
- Type-safe configuration with TypeScript

## Quick Start

Given the following Shopware entity:

```php title="src/Entity/StoreEntity.php"
<?php declare(strict_types=1);

namespace Frosh\Entity;

use Shopware\Core\Framework\DataAbstractionLayer\Attribute\Field;
use Shopware\Core\Framework\DataAbstractionLayer\Attribute\FieldType;
use Shopware\Core\Framework\DataAbstractionLayer\Attribute\PrimaryKey;
use Shopware\Core\Framework\DataAbstractionLayer\Attribute\Translations;
use Shopware\Core\Framework\DataAbstractionLayer\Entity;
use Shopware\Core\Framework\Struct\ArrayEntity;
use Symfony\Component\DependencyInjection\Attribute\AutoconfigureTag;

#[AutoconfigureTag('shopware.entity')]
#[\Shopware\Core\Framework\DataAbstractionLayer\Attribute\Entity('store')]
class StoreEntity extends Entity
{
    #[PrimaryKey]
    #[Field(type: FieldType::UUID)]
    public string $id;

    #[Field(type: FieldType::STRING, translated: true)]
    public ?string $name = null;

    /**
     * @var array<string, ArrayEntity>|null
     */
    #[Translations]
    public ?array $translations = null;
}
```

You can create a complete Administration module with just a few lines:

```javascript title="src/Resources/app/administration/src/main.js"
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
            name: {
                linkToDetail: true,
            }
        }
    }),
    detailComponent: registerDetailComponent({
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
    })
});
```

## Required Snippets

FroshJetpack uses translation keys for all labels. You need to provide snippet files for your module:

```json
{
    "jetpack-store": {
        "title": "Stores",
        "description": "Manage your stores",
        "list": {
            "actions": {
                "create": "Create store"
            },
            "columns": {
                "name": "Name"
            }
        },
        "detail": {
            "actions": {
                "save": "Save"
            },
            "cards": {
                "general": {
                    "title": "General",
                    "fields": {
                        "name": "Name"
                    }
                }
            }
        }
    }
}
```

## Next Steps

- [Module Registration](module-registration.md) - Learn about all module options
- [Listing Component](listing-component.md) - Configure your listing page
- [Detail Component](detail-component.md) - Configure your detail/create page
