import { type SchemaTypeDefinition } from 'sanity'
import { categoryType } from './categoryType'
import { blockContentType } from './blockContentType'
import { adressType } from './adressType'
import { authorType } from './authorType'
import { productType } from './productType'
import { orderType } from './orderType'
import { brandType } from './brandType'
import { blogType } from './blogType'
import { blogCategoryType } from './blogCategoryType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [categoryType, blockContentType, productType, orderType, brandType, blogType, blogCategoryType, authorType, adressType,],
}
