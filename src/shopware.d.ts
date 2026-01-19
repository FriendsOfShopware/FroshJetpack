interface Api {
    languageId: string;
}

// Define an interface for the context stored in Shopware.Store.
interface StoreContext {
    api: Api;
    isSystemDefaultLanguage: boolean;
    resetLanguageToDefault: () => void;
}

// Define the interface for the Shopware Store which returns a context object
// based on a key. For simplicity, we assume only 'context' is retrieved.
interface ShopwareStore {
    get: (key: string) => StoreContext;
}

// Define the interface for mutation commits via Shopware.State.
interface ShopwareState {
    commit: (mutation: string, payload?: string) => void;
    getters: Record<string, any>;
}

interface ShopwareData {
    Criteria: new (page?: number, limit?: number) => { setTerm: (term: string | null) => void };
}

interface ShopwareContext {
    api: Api;
}

interface ShopwareMixin {
    getByName: (name: string) => any;
}

interface Shopware {
    Store?: ShopwareStore;
    State: ShopwareState;
    Context: ShopwareContext;
    Data: ShopwareData;
    Mixin: ShopwareMixin;
    Component: any;
    EntityDefinition: any;
    Module: any;
}

declare const Shopware: Shopware;

declare module '*.html.twig' {
    const content: string;
    export default content;
}