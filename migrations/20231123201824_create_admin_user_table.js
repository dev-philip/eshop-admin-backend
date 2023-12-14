exports.up = function(knex) {
    return knex.schema.createTable('admin_users', function(table) {
      table.increments('id').primary();
      table.string('firstName');
      table.string('lastName');
      table.string('email');
      table.string('password');
      table.string('role_type');
      table.timestamps(true, true);  // Adds `created_at` and `updated_at` columns
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('admin_users');
  };