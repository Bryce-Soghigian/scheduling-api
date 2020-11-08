/**
The purpose of this table is to basically hold all the events in my calendar
 */
exports.up = function(knex) {
  return knex.schema.createTable("day", table => {
table.text("currentDate").references("date").inTable("calendar").unique()
table.text("00:00")
table.text("01:00")
table.text("02:00")
table.text("03:00")
table.text("04:00")
table.text("05:00")
table.text("06:00")
table.text("07:00")
table.text("08:00")
table.text("09:00")
table.text("10:00")
table.text("11:00")
table.text("12:00")
table.text("13:00")
table.text("14:00")
table.text("15:00")
table.text("16:00")
table.text("17:00")
table.text("18:00")
table.text("19:00")
table.text("20:00")
table.text("21:00")
table.text("22:00")
table.text("23:00")



})
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("day")
};
