/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  // stock field already included in base collection schema with min:0 - skip
}, (db) => {
  // no-op rollback
});
