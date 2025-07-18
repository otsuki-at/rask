# lib/update_users_active_state.rb

def change_active_state(names, activate:)
  from_state = !activate
  to_state = activate

  users = User.where(screen_name: names, active: from_state)

  if users.empty?
    puts "No matching #{from_state ? 'activate' : 'deactivate'} users found."
    exit 0
  end

  action = activate ? "activate" : "deactivate"
  puts "Found #{users.count} #{from_state ? 'activate' : 'deactivate'} user(s) to #{action}:"
  users.each { |u| puts "  - #{u.screen_name} (id: #{u.id})" }

  users.update_all(active: to_state)
  puts "Updated User.active:#{to_state}"
end

if ARGV.size < 2
  puts "Usage: rails runner lib/update_users_active_state.rb <activate|deactivate> <name1> <name2> ..."
  puts "<name> is screen_name"
  exit 0
end

command = ARGV.shift
names = ARGV

case command
when "activate"
  change_active_state(names, activate: true)
when "deactivate"
  change_active_state(names, activate: false)
else
  puts "Invalid command: #{command}. Use 'activate' or 'deactivate'."
  exit 1
end
