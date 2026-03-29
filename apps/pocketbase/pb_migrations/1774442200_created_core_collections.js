/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);

  const orders = new Collection({
    "id": "pbc_1784000001",
    "name": "orders",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": null,
    "indexes": [],
    "schema": [
      {
        "system": false, "id": "relation1784000001", "name": "userId", "type": "relation",
        "required": true, "options": { "collectionId": "_pb_users_auth_", "cascadeDelete": false, "minSelect": null, "maxSelect": 1, "displayFields": null }
      },
      {
        "system": false, "id": "json1784000002", "name": "items", "type": "json",
        "required": true, "options": { "maxSize": 0 }
      },
      {
        "system": false, "id": "number1784000003", "name": "totalAmount", "type": "number",
        "required": true, "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "system": false, "id": "select1784000004", "name": "status", "type": "select",
        "required": true, "options": { "maxSelect": 1, "values": ["pending","confirmed","shipped","delivered","cancelled"] }
      },
      {
        "system": false, "id": "text1784000005", "name": "shippingAddress", "type": "text",
        "required": true, "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "system": false, "id": "text1784000006", "name": "paymentMethod", "type": "text",
        "required": false, "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "system": false, "id": "text1784000007", "name": "stripeSessionId", "type": "text",
        "required": false, "options": { "min": null, "max": null, "pattern": "" }
      }
    ]
  });

  const cart = new Collection({
    "id": "pbc_1784001001",
    "name": "cart",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\"",
    "deleteRule": "@request.auth.id != \"\"",
    "indexes": [],
    "schema": [
      {
        "system": false, "id": "relation1784001001", "name": "userId", "type": "relation",
        "required": true, "options": { "collectionId": "_pb_users_auth_", "cascadeDelete": true, "minSelect": null, "maxSelect": 1, "displayFields": null }
      },
      {
        "system": false, "id": "json1784001002", "name": "items", "type": "json",
        "required": true, "options": { "maxSize": 0 }
      }
    ]
  });

  const reviews = new Collection({
    "id": "pbc_1784002001",
    "name": "reviews",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "userId = @request.auth.id",
    "deleteRule": "userId = @request.auth.id",
    "indexes": [],
    "schema": [
      {
        "system": false, "id": "relation1784002001", "name": "productId", "type": "relation",
        "required": true, "options": { "collectionId": "pbc_4092854851", "cascadeDelete": true, "minSelect": null, "maxSelect": 1, "displayFields": null }
      },
      {
        "system": false, "id": "relation1784002002", "name": "userId", "type": "relation",
        "required": true, "options": { "collectionId": "_pb_users_auth_", "cascadeDelete": true, "minSelect": null, "maxSelect": 1, "displayFields": null }
      },
      {
        "system": false, "id": "number1784002003", "name": "rating", "type": "number",
        "required": true, "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "system": false, "id": "text1784002004", "name": "comment", "type": "text",
        "required": false, "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "system": false, "id": "number1784002005", "name": "helpful", "type": "number",
        "required": false, "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "system": false, "id": "number1784002006", "name": "unhelpful", "type": "number",
        "required": false, "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "system": false, "id": "select1784002007", "name": "status", "type": "select",
        "required": false, "options": { "maxSelect": 1, "values": ["pending","approved","rejected"] }
      }
    ]
  });

  const coupons = new Collection({
    "id": "pbc_1784003001",
    "name": "coupons",
    "type": "base",
    "system": false,
    "listRule": "",
    "viewRule": "",
    "createRule": "@request.auth.role = \"admin\"",
    "updateRule": "@request.auth.role = \"admin\"",
    "deleteRule": "@request.auth.role = \"admin\"",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_coupon_code_unique` ON `coupons` (`code`)"
    ],
    "schema": [
      {
        "system": false, "id": "text1784003001", "name": "code", "type": "text",
        "required": true, "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "system": false, "id": "number1784003002", "name": "discountPercentage", "type": "number",
        "required": true, "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "system": false, "id": "date1784003003", "name": "expiryDate", "type": "date",
        "required": false, "options": { "min": "", "max": "" }
      },
      {
        "system": false, "id": "bool1784003004", "name": "isActive", "type": "bool",
        "required": true, "options": {}
      },
      {
        "system": false, "id": "number1784003005", "name": "maxUses", "type": "number",
        "required": false, "options": { "min": null, "max": null, "noDecimal": false }
      },
      {
        "system": false, "id": "number1784003006", "name": "timesUsed", "type": "number",
        "required": false, "options": { "min": null, "max": null, "noDecimal": false }
      }
    ]
  });

  const wishlist = new Collection({
    "id": "pbc_1784004001",
    "name": "wishlist",
    "type": "base",
    "system": false,
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": null,
    "deleteRule": "@request.auth.id != \"\"",
    "indexes": [],
    "schema": [
      {
        "system": false, "id": "relation1784004001", "name": "userId", "type": "relation",
        "required": true, "options": { "collectionId": "_pb_users_auth_", "cascadeDelete": true, "minSelect": null, "maxSelect": 1, "displayFields": null }
      },
      {
        "system": false, "id": "relation1784004002", "name": "productId", "type": "relation",
        "required": true, "options": { "collectionId": "pbc_4092854851", "cascadeDelete": true, "minSelect": null, "maxSelect": 1, "displayFields": null }
      }
    ]
  });

  dao.saveCollection(orders);
  dao.saveCollection(cart);
  dao.saveCollection(reviews);
  dao.saveCollection(coupons);
  return dao.saveCollection(wishlist);
}, (db) => {
  const dao = new Dao(db);
  dao.deleteCollection(dao.findCollectionByNameOrId("pbc_1784004001"));
  dao.deleteCollection(dao.findCollectionByNameOrId("pbc_1784003001"));
  dao.deleteCollection(dao.findCollectionByNameOrId("pbc_1784002001"));
  dao.deleteCollection(dao.findCollectionByNameOrId("pbc_1784001001"));
  return dao.deleteCollection(dao.findCollectionByNameOrId("pbc_1784000001"));
});
