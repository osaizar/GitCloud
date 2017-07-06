import subprocess
import pipes # used to filter the input and avoid command injection
import os
import sshpubkeys
from models import GitFile, SSHKey

GIT_PATH = "/gitCloud/"
#GIT_PATH = "../gitserver/" # debug

def run(command, path=False):
    if path:
        out = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, cwd=path)
        return out.stdout.read(), out.stderr.read()
    else:
        os.system(command)

def get_files_from_repo(username, repo, path):
    username = pipes.quote(username)
    repo = pipes.quote(repo)
    path = pipes.quote(path)

    if path == "/":
        path = ""
    else:
        path = path + "/"

    print path

    files = []
    command = "git ls-tree --full-tree HEAD "+path
    repo_path = GIT_PATH+username+"/"+repo+".git" # + .git ?
    out, err = run(command, repo_path)
    for line in out.split("\n"):
        words = line.split(" ")
        if len(words) > 2:
            ftype = ""
            fname = ""

            if words[1] == "blob":
                ftype = "file"
            else:
                ftype = "folder"

            for i in range(2, len(words)):
                fname += words[i]+" "

            fname = fname.split("\t")[1]
            fname = fname[:-1] # remove last space
            files.append(GitFile(ftype, fname))

    return files

def get_file_content(username, repo, path):
    username = pipes.quote(username)
    repo = pipes.quote(repo)
    path = pipes.quote(path)

    command = "git show master:"+path
    repo_path = GIT_PATH+username+"/"+repo+".git"
    out, err = run(command, repo_path)
    if err == "":
        return out
    else:
        # print err # debug
        return None

def create_repository(username, repo, private):
    username = pipes.quote(username)
    repo = pipes.quote(repo)

    run("mkdir "+repo+".git", GIT_PATH+username)
    run("git init --bare", GIT_PATH+username+"/"+repo+".git")
    run("chown "+username+":gitusers "+repo+".git -R", GIT_PATH+username)

    if private:
        run("chmod 700 "+GIT_PATH+username+"/"+repo+".git")
    else:
        run("chmod 750 "+GIT_PATH+username+"/"+repo+".git")

def add_user_to_repository(repouser, repo, user, level):
    repouser = pipes.quote(repouser)
    repo = pipes.quote(repo)
    user = pipes.quote(user)

    if level == "read":
        mod = "rx"
    elif level == "write":
        mod = "rwx"
    else: # none
        mod = "x"

    run("setfacl -R -m u:"+user+":"+mod+" "+GIT_PATH+repouser+"/"+repo+".git")

    #setfacl -m u:+user+:+mod+ +file+
    # chmod mod user repouser/repo

def create_user(username, password):
    username = pipes.quote(username)
    password = pipes.quote(password)

    run("useradd "+username+" -G gitusers -d /home/"+username+" -m -s $(command -v git-shell)")
    run("echo "+username+":"+password+" | chpasswd")
    run("mkdir "+GIT_PATH+username)
    run("chown "+username+":gitusers "+GIT_PATH+username)
    run("chmod 750 "+GIT_PATH+username)

    run("mkdir /home/"+username+"/.ssh")
    run("touch /home/"+username+"/.ssh/authorized_keys")
    run("chown "+username+":"+username+" -R /home/"+username+"/.ssh")

def change_user_password(username, password):
    username = pipes.quote(username)
    password = pipes.quote(password)

    run("echo "+username+":"+password+" | chpasswd")

def get_user_ssh_keys(username):
    username = pipes.quote(username)

    keyFile = open("/home/"+username+"/.ssh/authorized_keys", "r")
    keys = []

    for line in keyFile.read().split("\n"):
        if line:
            k = sshpubkeys.SSHKey(line)
            keys.append(SSHKey(k.comment, k.hash_md5()))

    keyFile.close()

    return keys

def add_user_ssh_key(username, key):
    username = pipes.quote(username)

    k = sshpubkeys.SSHKey(key)
    try:
        k.parse()
        run("mkdir -p /home/"+username+"/.ssh")
        run("echo '"+key+"' >> /home/"+username+"/.ssh/authorized_keys")
    except:
        return False

    return True

def remove_user_ssh_key(username, hash):
    username = pipes.quote(username)
    changed = False

    try:
        lines = open("/home/"+username+"/.ssh/authorized_keys", "r").read().split("\n")
        file = open("/home/"+username+"/.ssh/authorized_keys", "w")

        for l in lines:
            if l:
                lkey = sshpubkeys.SSHKey(l)
                if hash not in lkey.hash_md5():
                    file.write(l+"\n")
                else:
                    changed = True

        file.close()
    except:
        return False

    return changed

def init_gitServer():
    run("groupadd gitusers")
    run("useradd gitadmin -G gitusers")
    run("mkdir -p "+GIT_PATH)
    run("chown gitadmin:gitusers "+GIT_PATH)
    run("chmod 770 "+GIT_PATH)
