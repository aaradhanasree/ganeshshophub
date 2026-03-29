/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const snapshot = [
    {
      "id": "pbc_4092854851",
      "created": "",
      "updated": "",
      "name": "products",
      "type": "base",
      "system": false,
      "schema": [
        {
          "system": false,
          "id": "text1579384326",
          "name": "name",
          "type": "text",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": { "min": null, "max": null, "pattern": "" }
        },
        {
          "system": false,
          "id": "text1843675174",
          "name": "description",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": { "min": null, "max": null, "pattern": "" }
        },
        {
          "system": false,
          "id": "number3402113753",
          "name": "price",
          "type": "number",
          "required": true,
          "presentable": false,
          "unique": false,
          "options": { "min": null, "max": null, "noDecimal": false }
        },
        {
          "system": false,
          "id": "number1261852256",
          "name": "stock",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": { "min": 0, "max": null, "noDecimal": false }
        },
        {
          "system": false,
          "id": "text105650625",
          "name": "category",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": { "min": null, "max": null, "pattern": "" }
        },
        {
          "system": false,
          "id": "number3632866850",
          "name": "rating",
          "type": "number",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": { "min": null, "max": null, "noDecimal": false }
        },
        {
          "system": false,
          "id": "file3309110367",
          "name": "image",
          "type": "file",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": { "maxSelect": 1, "maxSize": 5242880, "mimeTypes": [], "thumbs": [], "protected": false }
        },
        {
          "system": false,
          "id": "text_brand_001",
          "name": "brand",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": { "min": null, "max": null, "pattern": "" }
        },
        {
          "system": false,
          "id": "text_warranty_001",
          "name": "warranty",
          "type": "text",
          "required": false,
          "presentable": false,
          "unique": false,
          "options": { "min": null, "max": null, "pattern": "" }
        }
      ],
      "indexes": [],
      "listRule": "",
      "viewRule": "",
      "createRule": "@request.auth.id != \"\"",
      "updateRule": "@request.auth.role = \"admin\"",
      "deleteRule": "@request.auth.id != \"\"",
      "options": {}
    }
  ];

  const collections = snapshot.map((item) => new Collection(item));
  return Migrate.importCollections(db, collections, false);
}, (db) => {
  return Migrate.deleteCollection(db, "pbc_4092854851");
});
