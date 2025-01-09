# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
task_states = TaskState.create!([
                                  { name: 'todo', priority: 1, color: "red", about:"やるべき Task"},
                                  { name: 'done', priority: 0, color: "black", about:"完了した Task"},
                                  { name: 'draft', priority: 2, color: "gray", about:"書きかけの Task"},
                                ])
