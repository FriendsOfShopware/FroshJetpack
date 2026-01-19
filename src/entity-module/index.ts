export type EntityModule = {
    entity: string,
    color?: string,
    icon?: string,
    parentPath?: string,
    showInSettings?: boolean,
    showInNavigation?: boolean,
    listingComponent: string,
    detailComponent: string,
    navigationParentModule?: string
}

export function registerEntityModule(userConfig: EntityModule) {
    const moduleName = `jetpack-${userConfig.entity.replaceAll('_', '-')}`
    const config = {
        ...userConfig,
        moduleName,
        baseRouteName: moduleName.replaceAll('-', '.'),
        color: userConfig.color || '#9AA8B5',
        icon: userConfig.icon || 'regular-envelope',
        parentPath: userConfig.parentPath || 'sw.settings.index.plugins',
        showInSettings: userConfig.showInSettings || false,
        showInNavigation: userConfig.showInNavigation || true,
        navigationParentModule: userConfig.navigationParentModule || 'sw-customer',
    }

    Shopware.Module.register(config.moduleName, {
        type: 'plugin',
        name: `${config.moduleName}.title`,
        title: `${config.moduleName}.title`,
        description: `${config.moduleName}.description`,
        color: config.color,
        icon: config.icon,
        entity: config.entity,

        routes: {
            list: {
                component: config.listingComponent,
                path: 'list',
                meta: {
                    privilege: `${config.entity}:read`,
                    parentPath: config.parentPath
                },
            },
            create: {
                component: config.detailComponent,
                path: 'create',
                meta: {
                    privilege: `${config.entity}:create`,
                    parentPath: `${config.baseRouteName}.list`
                },
                props: {
                    default: () => {
                        return { entityId: null };
                    },
                },
            },
            detail: {
                component: config.detailComponent,
                path: 'detail/:id',
                meta: {
                    privilege: `${config.entity}:read`,
                    parentPath: `${config.baseRouteName}.list`
                },
                props: {
                    default: ($route) => {
                        return { entityId: $route.params.id };
                    },
                },
            }
        },

        navigation: config.showInNavigation ? [{
            label: `${config.moduleName}.title`,
            color: config.icon,
            path: `${config.baseRouteName}.list`,
            parent: config.navigationParentModule,
            icon: config.icon,
            position: 100
        }] : [],

        settingsItem: config.showInSettings ? [
            {
                group: 'plugins',
                to: `${config.baseRouteName}.list`,
                icon: config.icon,
                name: `${config.moduleName}.title`,
                privilege: `${config.entity}:read`
            }
        ] : []
    })
}
