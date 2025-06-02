export function setState(store: string, key: string, ...args: any) {
    if (Shopware.Store && Shopware.Store.get('context')) {
        Shopware.Store.get(store)[key](...args);
    } else {
        Shopware.State.commit(store + '/' + key, ...args);
    }
}

export function getState(store: string, key: string) {
    if (Shopware.Store && Shopware.Store.get('context')) {
        return Shopware.Store.get(store)[key];
    } else {
        return Shopware.State.getters[store + '/' + key];
    }
}

export function isEntityTranslatable(entity: string) {
    return Shopware.EntityDefinition.getDefinitionRegistry().get(entity).properties.translated !== undefined;
}