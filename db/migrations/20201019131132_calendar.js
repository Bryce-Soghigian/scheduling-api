exports.up = function(knex) {
return knex.schema.createTable("calendar", tbl => {
    tbl.text("date").unique()//03-31-2000
    tbl.text("day")//Monday
})
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("calendar")
};


