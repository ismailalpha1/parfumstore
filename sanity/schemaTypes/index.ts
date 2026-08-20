import { type SchemaTypeDefinition } from 'sanity'
import { categoryType } from './categoryType'
import { blockContentType } from './blockContentType'
import { adressType } from './adressType'
import { authorType } from './authorType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, blockContentType, productType, orderType, brandType, blogType, blogCategoryType, authorType, adressType,],
}
