import os

from database import init_db
from git_helper import init_gitServer

os.system("rm database.db")

print "[+] Init Database"
init_db()

print "[+] Init Git Server"
init_gitServer()
