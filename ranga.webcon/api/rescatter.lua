ranga.luaload('ranga.ext.base/utils/uri.lua')
query = uri.parsequery(os.getenv('QUERY_STRING'))

print('Content-type: ' .. query['type'] .. ', charset=utf-8')
print('')

f = ranga.openfile('ranga.webcon/webcon/' .. query['file'])
io.write(f:read("*a"))
