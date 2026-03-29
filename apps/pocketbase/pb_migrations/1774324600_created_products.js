/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "pbc_4092854851",
    "name": "products",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.role = \"admin\"",
    "deleteRule": "@request.auth.id != \"\"",
    "indexes": [],
    "schema": [
      {
        "id": "text1579384326",
        "name": "name",
        "type": "text",
        "system": false,
        "required": true,
        "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "id": "text1843675174",
        "name": "description",
        "type": "text",
        "system": false,
        "required": false,
        "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "id": "number3402113753",
        "name": "price",
        "type": "number",
        "system": false,
        "required": true,
        "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "id": "number1261852256",
        "name": "stock",
        "type": "number",
        "system": false,
        "required": false,
        "options": { "min": 0, "max": null, "noDecimal": false }
      },
      {
        "id": "text105650625",
        "name": "category",
        "type": "text",
        "system": false,
        "required": false,
        "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "id": "number3632866850",
        "name": "rating",
        "type": "number",
        "system": false,
        "required": false,
        "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "id": "file3309110367",
        "name": "image",
        "type": "file",
        "system": false,
        "required": false,
        "options": { "maxSelect": 1, "maxSize": 5242880, "mimeTypes": [], "thumbs": [], "protected": false }
      },
      {
        "id": "text_brand_001",
        "name": "brand",
        "type": "text",
        "system": false,
        "required": false,
        "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "id": "text_warranty_001",
        "name": "warranty",
        "type": "text",
        "system": false,
        "required": false,
        "options": { "min": null, "max": null, "pattern": "" }
      }
    ]
  });

  app.dao().saveCollection(collection);
}, (app) => {
  const collection = app.dao().findCollectionByNameOrId("pbc_4092854851");
  app.dao().deleteCollection(collection);
});
