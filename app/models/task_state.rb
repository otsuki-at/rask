class TaskState < ApplicationRecord
  has_many :tasks, dependent: :restrict_with_exception

  validates :name, presence: true
  validates :priority, presence: true

  def self.ransackable_attributes(auth_object = nil)
    [ "priority" ]
  end
end
