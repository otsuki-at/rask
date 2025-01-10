class Project < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :restrict_with_exception
  has_many :documents, dependent: :restrict_with_exception
  validates :name, presence: true

  def self.ransackable_attributes(auth_object = nil)
    ["created_at", "id", "name", "tasks", "updated_at", "user_id"]
  end
end
