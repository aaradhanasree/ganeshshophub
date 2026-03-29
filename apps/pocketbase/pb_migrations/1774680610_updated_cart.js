/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pbc_1784001001");
  const schema = collection.schema;
  const itemsField = schema.getFieldById("json1784001002");
  if (itemsField) {
    itemsField.required = false;
  }
  return dao.saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("pbc_1784001001");
  const schema = collection.schema;
  const itemsField = schema.getFieldById("json1784001002");
  if (itemsField) {
    itemsField.required = true;
  }
  return dao.saveCollection(collection);
});
