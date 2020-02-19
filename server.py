import http.server as hs
import socketserver as ss

port = 8000
Handler = hs.SimpleHTTPRequestHandler
print("starting web server")
with ss.TCPServer(("", port), Handler) as httpd:
    print("started webserver at port: ",port)
    httpd.serve_forever()