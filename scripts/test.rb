if ARGV.length == 0
  exec "mocha tests --recursive --compilers js:babel-core/register"
end

name = `find tests -name "*.js" | grep #{ARGV[0]}`
name = name.strip
print "mocha tests #{name} --compilers js:babel/register"
exec "mocha #{name} --compilers js:babel/register"
