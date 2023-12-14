# Project documentation

Eshop admin Backend

I have an next js application and a node express backend. I want to create a login and registration system and I want to use knex.js for orm and oop style with mvc for the login and registration. ALso I am using typescript for my node express application

# Create migrations

npx knex migrate:make create_admin_user_table

# Run migrations

npx knex migrate:latest
npx knex migrate:rollback
npx knex migrate:status

# Run seed data (if you have seed files)

npx knex seed:run
