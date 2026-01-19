import { isEntityTranslatable, setState } from '../utils';
// @ts-ignore
import template from './list.html.twig';

type DataGridColumn = {
    property: string,
    label: string,
    sortable: boolean,
    width: string,
    allowResize: boolean,
    visible: boolean,
    naturalSorting: boolean,
    align: string
    inlineEdit: string | null
    routerLink: string | null
}

type ListingOptions = {
    entity: string,
    showSearchBar?: boolean,
    columns: Record<string, {
        label: string,
        sortable?: boolean,
        allowResize?: boolean,
        width?: string,
        visible?: boolean
        align?: 'left' | 'right'
        naturalSorting?: boolean,
        inlineEdit?: 'string' | 'number'
        linkToDetail?: boolean
    }>
}

type ListingMerged = ListingOptions & {
    baseRouteName: string,
    moduleName: string,
}

export function registerListingComponent(userConfig: ListingOptions): string {
    const moduleName = `jetpack-${userConfig.entity.replaceAll('_', '-')}`
    const config: ListingMerged = {
        ...userConfig,
        baseRouteName: moduleName.replaceAll('-', '.'),
        moduleName,
        showSearchBar: userConfig.showSearchBar || false,
    }

    const componentName = `${config.moduleName}-list`

    Shopware.Component.register(componentName, {
        template,
        inject: ['repositoryFactory', 'acl'],
        mixins: [
            Shopware.Mixin.getByName('listing'),
        ],
        metaInfo() {
            return {
                title: this.$createTitle()
            };
        },

        data() {
            return {
                config,
                term: null,
                items: null,
                page: 1,
                limit: 25,
                total: 0,
                isLoading: true,
                translatable: isEntityTranslatable(userConfig.entity)
            }
        },

        computed: {
            columns() {
                const columns: DataGridColumn[] = [];

                for (const [key, value] of Object.entries(config.columns)) {
                    columns.push({
                        property: key,
                        label: value.label,
                        sortable: value.sortable || true,
                        width: value.width || 'auto',
                        allowResize: value.allowResize || true,
                        visible: value.visible || true,
                        align: value.align || 'left',
                        naturalSorting: value.naturalSorting || false,
                        inlineEdit: value.inlineEdit || null,
                        routerLink: value.linkToDetail ? `${config.baseRouteName}.detail` : null,
                    })
                }
                return columns;
            },

            repository() {
                return this.repositoryFactory.create(config.entity);
            },
        },

        methods: {
            getList() {
                this.isLoading = true;
                this.repository.search(this.getCriteria(), Shopware.Context.api).then((result) => {
                    this.items = result;
                    this.total = result.total;
                }).finally(() => {
                    this.isLoading = false;
                });
            },

            onChangeLanguage(languageId: string) {
                setState('context', 'setApiLanguageId', languageId);
                this.getList();
            },

            getCriteria() {
                const criteria = new Shopware.Data.Criteria(this.page, this.limit);
                criteria.setTerm(this.term);

                return criteria;
            }
        }
    })

    return componentName;
}
