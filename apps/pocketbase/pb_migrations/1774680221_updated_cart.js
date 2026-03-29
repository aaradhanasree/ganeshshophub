/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  // autodate fields are already included in the base collection schema - skip
}, (db) => {
  // no-op rollback
});
