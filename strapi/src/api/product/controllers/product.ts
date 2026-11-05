/**
 * product controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::product.product', () => ({
  async find(ctx) {
    ctx.query = {
      ...ctx.query,
      status: 'published',
      populate: {
        images: true,
        product_category: true,
        product_meta: true,
        product_size: true,
        variant: { populate: { products: { fields: ['name', 'documentId'], populate: ['images'] } } },
      },
    };

    return super.find(ctx);
  },

  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      status: 'published',
      populate: {
        images: true,
        product_category: true,
        product_meta: true,
        product_size: true,
        variant: { populate: { products: { fields: ['name', 'documentId'], populate: ['images'] } } },
      },
    };

    return super.findOne(ctx);
  },
}));
