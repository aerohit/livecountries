require 'sinatra'

get '/' do
  #@vd_domain = "localhost:3000"
  @vd_domain = "acc.vakantiediscounter.nl"
  erb :index
end
