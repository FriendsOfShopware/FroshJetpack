import { isEntityTranslatable, setState } from '../utils.js';
// @ts-ignore
import template from './detail.html.twig';

type InputType = 'text' | 'number' | 'checkbox' | 'password' | 'textarea' | 'url' | 'select' | 'multi-select'

export type DetailField<T extends InputType = InputType> = {
    type: T;
    placeholder?: string;
    helpText?: string;
  } & (T extends 'multi-select' | 'select' ? { options: Record<string, string> } : {});

type CardOptions<K extends string> = {
    name: string,
    fields: Record<K, DetailField>
}

type DetailOptions<C extends CardOptions<string>[]> = {
    entity: string,
    cards: C,
    labelProperty?: string,
}

type DetailMerged = DetailOptions<CardOptions<string>[]> & {
    moduleName: string,
    baseRouteName: string,
    translatable: boolean,
    labelProperty: string,
}

function toCamelCase(value: string) {
    return value.split('_').map((word, index) => {
        if (index === 0) {
            return word.toLowerCase()
        }

        return word.charAt(0).toUpperCase() + word.slice(1)
    }).join('')
}

export function registerDetailComponent<C extends CardOptions<string>[]>(userConfig: C extends [] ? never : DetailOptions<C>): string {
    const moduleName = `jetpack-${userConfig.entity.replaceAll('_', '-')}`
    const config: DetailMerged = {
        ...userConfig,
        moduleName,
        baseRouteName: moduleName.replaceAll('-', '.'),
        translatable: isEntityTranslatable(userConfig.entity),
        labelProperty: userConfig.labelProperty || 'name',
    }

    const entityNameCamelCase = toCamelCase(userConfig.entity)

    const componentName = `${config.moduleName}-detail`

    Shopware.Component.register(componentName, {
        template,
        inject: ['repositoryFactory'],
        mixins: [
            Shopware.Mixin.getByName('notification'),
            Shopware.Mixin.getByName('placeholder'),
        ],
        props: {
            entityId: {
                type: String,
                required: false
            }
        },

        shortcuts: {
            'SYSTEMKEY+S': 'onSave',
        },

        metaInfo() {
            return {
                title: this.$createTitle()
            };
        },

        data() {
            return {
                config,
                item: null,
                isLoading: true,
                isSaveSuccessful: false,
            }
        },

        computed: {
            repository() {
                return this.repositoryFactory.create(config.entity);
            },

            entityDescription() {
                return this.placeholder(this.item, config.labelProperty, this.item?.id || '');
            },

            ...Shopware.Component.getComponentHelper().mapPropertyErrors(entityNameCamelCase, Object.keys(Shopware.EntityDefinition.getRequiredFields(userConfig.entity)).filter((field) => field !== 'id' && field !== 'createdAt'))
        },

        methods: {
            getInputComponent(type: InputType) {
                switch (type) {
                    case 'text':
                        return 'sw-text-field'
                    case 'number':
                        return 'sw-number-field'
                    case 'checkbox':
                        return 'sw-checkbox-field'
                    case 'password':
                        return 'sw-password-field'
                    case 'textarea':
                        return 'sw-textarea-field'
                    case 'url':
                        return 'sw-url-field'
                    case 'multi-select':
                        return 'sw-multi-select'
                    case 'select':
                        return 'mt-select'
                }

                throw new Error(`Invalid input type: ${type}`);
            },

            getInputProps(field: DetailField, cardName: string, fieldName: string) {
                const props: Record<string, any> = {}

                props.label = this.$tc(`${config.moduleName}.detail.cards.${cardName}.fields.${fieldName}`)
                props.placeholder = this.placeholder(this.item, fieldName, field.placeholder || '')
                props.helpText = field.helpText

                if (Object.keys(Shopware.EntityDefinition.getRequiredFields(userConfig.entity)).includes(fieldName)) {
                    props.error = this[entityNameCamelCase + fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + 'Error']
                }

                switch (field.type) {
                    case 'multi-select':
                    case 'select':
                        props.options = [];

                        for (const [key, value] of Object.entries((field as DetailField<'select'>).options)) {
                            props.options.push({
                                label: this.$tc(key),
                                value: value
                            })
                        }
                }

                return props
            },

            getItem() {
                this.isLoading = true;
                if (!this.entityId) {
                    this.item = this.repository.create(Shopware.Context.api);
                    this.isLoading = false;
                    return;
                }

                this.repository.get(this.entityId, Shopware.Context.api).then((result) => {
                    this.item = result;
                }).finally(() => {
                    this.isLoading = false;
                });
            },

            abortOnLanguageChange() {
                return this.repository.hasChanges(this.item);
            },

            saveOnLanguageChange() {
                return this.onSave();
            },

            onChangeLanguage() {
                this.getItem();
            },

            onSave() {
                this.isSaveSuccessful = false;
                this.repository.save(this.item, Shopware.Context.api)
                    .catch(() => {
                        this.createNotificationError({
                            message: this.$tc('sw-settings-tax.detail.messageSaveError'),
                        });
                    })
                    .then((e) => {
                        this.isSaveSuccessful = true;

                        if (!this.entityId) {
                            this.$router.push({ name: `${config.baseRouteName}.detail`, params: { id: this.item.id } });
                            return;
                        }

                        this.getItem();
                    });
            },

            saveFinish() {
                this.isSaveSuccessful = false;
            }
        },

        created() {
            if (!this.entityId) {
                setState('context', 'resetLanguageToDefault');
            }

            this.getItem();
        }
    });

    return componentName;
}
