#!/usr/bin/env python3

# See https://docs.python.org/3.x/library/socket.html
# for a description of python socket and its parameters
# 
# Copyright 2018, Daniel J. Challou, All rights reserved.
# For use by students enrolled in Csci 4131 during the Fall 2018 
# Semester at the University of
# Minnesota-Twin Cities only. Do not copy or redistribute
# without the express written consent of the authors.
#
# modified by Daniel Hartmann for CSCI4131 HW04

#add the following
import socket
import os
import stat
import sys
import urllib.parse
import datetime

from threading import Thread
from argparse import ArgumentParser



BUFSIZE = 4096
#add the following
CRLF = '\r\n'
METHOD_NOT_ALLOWED = 'HTTP/1.1 405  METHOD NOT ALLOWED{}Allow: GET, HEAD, POST {}Connection: close{}{}'.format(CRLF, CRLF, CRLF, CRLF)
NOT_ACCEPTABLE = 'HTTP/1.1 406  FILETYPE NOT ACCEPTABLE{}Allow: GET, HEAD, POST {}Connection: close{}{}'.format(CRLF, CRLF, CRLF, CRLF)
OK = 'HTTP/1.1 200 OK{}'.format(CRLF)
NOT_FOUND = 'HTTP/1.1 404 NOT FOUND{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
FORBIDDEN = 'HTTP/1.1 403 FORBIDDEN{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
MOVED_PERMANENTLY = 'HTTP/1.1 301 MOVED PERMANENTLY{}Location:  https://twin-cities.umn.edu/{}Connection: close{}{}'.format(CRLF, CRLF, CRLF, CRLF)

def get_contents(fname):
    with open(fname, 'r') as f:
        return f.read()


def check_perms(resource):
    """Returns True if resource has read permissions set on 'others'"""
    stmode = os.stat(resource).st_mode
    return (getattr(stat, 'S_IROTH') & stmode) > 0
	
class HTTP_HeadServer:  #A re-worked version of EchoServer
  def __init__(self, host, port):
    print('listening on port {}'.format(port))
    self.host = host
    self.port = port

    self.setup_socket()

    self.accept()

    self.sock.shutdown()
    self.sock.close()

  def setup_socket(self):
    self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    self.sock.bind((self.host, self.port))
    self.sock.listen(128)

  def accept(self):
    while True:
      (client, address) = self.sock.accept()
      #th = Thread(target=client_talk, args=(client, address))
      th = Thread(target=self.accept_request, args=(client, address))
      th.start()

  # here, we add a function belonging to the class to accept 
  # and process a request
  def accept_request(self, client_sock, client_addr):
    print("accept request")
    data = client_sock.recv(BUFSIZE)
    req = data.decode('utf-8') #returns a string
    response=self.process_request(req) #returns a string
    #once we get a response, we chop it into utf encoded bytes
    #and send it (like EchoClient)
    client_sock.send(response)
	
    #clean up the connection to the client
    #but leave the server socket for recieving requests open
    client_sock.shutdown(1)
    client_sock.close()

  #added a method to process requests, only head is handled in this code
  def process_request(self, request):
    print('######\nREQUEST:\n{}######'.format(request))
    linelist = request.strip().split(CRLF)
    reqline = linelist[0]
    rlwords = reqline.split()
    if len(rlwords) == 0:
        return ''
		
    if rlwords[0] == 'HEAD':
        resource = rlwords[1][1:] # skip beginning /
        return bytes(self.head_request(resource),'utf-8')
    elif rlwords[0] == 'GET':
      head = self.head_request(rlwords[1][1:])
      #check if able to make a valid post or need to return error message
      if "OK" in head:
        if (head != OK):
          with open(rlwords[1][1:],"rb") as f:
            data = f.read()
            #check if a text-based file 
            for ext in [".html",".css",".js"]:
              if rlwords[1].endswith(ext):
                data = data.decode('utf-8')
                #use utf-8 encoding on the data
                return bytes(head + data,'utf-8')
              else:
                #use raw data for all other files
                return bytes(head,'utf-8') + data
        else:
          #did not find a valid file type in the data
          return bytes(NOT_ACCEPTABLE, 'utf-8')
      elif "NOT FOUND" in head:
        with open("./404.html","rb") as f:
          data = f.read().decode('utf-8')
          return bytes(head + data,'utf-8')
      elif "FORBIDDEN" in head:
        with open("./403.html","rb") as f:
          data = f.read().decode('utf-8')
          return bytes(head + data,'utf-8')
    elif rlwords[0] == 'POST':
      form = dict()
      print(request.splitlines()[-1])
      for i in request.splitlines()[-1].split('&'):
        temp = i.split('=')
        form[temp[0]] = temp[1].replace("%3A", ":")
      #create table html document 
      html = "<!doctype HTML><html><head><style> table, th, td {border: 1px solid black; border-collapse: collapse;}th, td {padding: 5px;}  th, td {text-align: left;} th, td {padding: 15px;}</style></head><body><table>"
      for i in form.keys():
        html += "<tr><th>" + i + ": </th> <td>" + form[i] + "</td></tr>"
      html += "</table></body></html>"
      #send off html string as bytes to serve
      return bytes(OK + CRLF + CRLF + html, 'utf-8')
    else:
      #invalid request type
      return bytes(METHOD_NOT_ALLOWED,'utf-8')

  def head_request(self, resource):
    """Handles HEAD requests."""
    path = os.path.join('.', resource) #look in directory where server is running
    if resource == 'umntc':
      ret = MOVED_PERMANENTLY
    elif not os.path.exists(resource):
      ret = NOT_FOUND
    elif not check_perms(resource):
      ret = FORBIDDEN
    else:
      ret = OK
      filetype = {".html": "text/html",
                  ".css": "text/css",
                  ".js": "application/javascript",
                  ".png": "image/png",
                  ".mp3": "audio/mpeg"}
      for k in filetype.keys():
          if resource.endswith(k):
              ret += "Content-type:" + filetype[k] + CRLF + CRLF
    return ret

#to do a get request, read resource contents and append to ret value.
#(you should check types of accept lines before doing so)

def parse_args():
  parser = ArgumentParser()
  parser.add_argument('--host', type=str, default='localhost',
                      help='specify a host to operate on (default: localhost)')
  parser.add_argument('-p', '--port', type=int, default=9001,
                      help='specify a port to operate on (default: 9001)')
  args = parser.parse_args()
  return (args.host, args.port)


if __name__ == '__main__':
  (host, port) = parse_args()
  HTTP_HeadServer(host, port) #Formerly EchoServer


