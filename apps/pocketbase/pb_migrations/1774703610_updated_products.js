/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  // brand and warranty fields already included in base collection schema - skip
}, (db) => {
  // no-op rollback
});
