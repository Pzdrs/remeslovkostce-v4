import type { Schema, Struct } from '@strapi/strapi';

export interface ProductMetaBoxes extends Struct.ComponentSchema {
  collectionName: 'components_product_meta_boxes';
  info: {
    displayName: 'Boxes';
  };
  attributes: {
    box_color: Schema.Attribute.Enumeration<
      ['plain', 'cloudy', 'black', 'white', 'red', 'blue', 'green', 'yellow']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'plain'>;
    box_material: Schema.Attribute.Enumeration<['cardboard', 'plastic']> &
      Schema.Attribute.Required;
    fill_color: Schema.Attribute.Enumeration<['white', 'colored']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'white'>;
  };
}

export interface ProductMetaFlipChart extends Struct.ComponentSchema {
  collectionName: 'components_product_meta_flip_charts';
  info: {
    displayName: 'Flip-chart';
  };
  attributes: {
    grid_print: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
    perforated: Schema.Attribute.Boolean &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface ProductMetaMemoPads extends Struct.ComponentSchema {
  collectionName: 'components_product_meta_memo_pads';
  info: {
    displayName: 'Memo pads';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<['white', 'colored']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'white'>;
  };
}

export interface ProductSizesSheetCount extends Struct.ComponentSchema {
  collectionName: 'components_product_sizes_sheet_counts';
  info: {
    displayName: 'Sheet count';
  };
  attributes: {
    height: Schema.Attribute.Integer & Schema.Attribute.Required;
    sheets: Schema.Attribute.Integer & Schema.Attribute.Required;
    unit: Schema.Attribute.Enumeration<['mm', 'cm', 'm']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'cm'>;
    width: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface ProductSizesThreeDimensional extends Struct.ComponentSchema {
  collectionName: 'components_product_sizes_three_dimensionals';
  info: {
    displayName: 'Three dimensional';
  };
  attributes: {
    depth: Schema.Attribute.Integer & Schema.Attribute.Required;
    height: Schema.Attribute.Integer & Schema.Attribute.Required;
    unit: Schema.Attribute.Enumeration<['mm', 'cm', 'm']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'cm'>;
    width: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'product-meta.boxes': ProductMetaBoxes;
      'product-meta.flip-chart': ProductMetaFlipChart;
      'product-meta.memo-pads': ProductMetaMemoPads;
      'product-sizes.sheet-count': ProductSizesSheetCount;
      'product-sizes.three-dimensional': ProductSizesThreeDimensional;
    }
  }
}
