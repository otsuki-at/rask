class WelcomeController < ApplicationController
  skip_before_action :logged_in_user
  layout 'welcome'

  def index
  end
end
