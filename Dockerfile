FROM ruby:3.3.6

RUN curl https://deb.nodesource.com/setup_18.x | bash
RUN apt-get update -qq && apt-get install -y nodejs
