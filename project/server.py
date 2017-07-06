from flask import Flask, request, render_template, abort, jsonify
import random, string
from werkzeug.security import generate_password_hash, check_password_hash

import db_helper as db
import git_helper as git
from validator import validate_json, validate_schema, validate_token
from models import User, Repository, Collaboration, Session, GitFile, SSHKey

PORT = 5000
ADDR = "0.0.0.0"

GIT = True # run git_helper functions

app = Flask(__name__)

# Imports
@app.route("/img/logo.png")
def logoPNG():
    return app.send_static_file("img/logo.png")

@app.route("/img/profile.png")
def profilePNG():
    return app.send_static_file("img/profile.png")

@app.route("/img/loading.gif")
def loadingGIF():
    return app.send_static_file("img/loading.gif")

@app.route("/css/client.css")
def clientCSS():
    return app.send_static_file("css/client.css")

@app.route("/lib/bootstrap/css/bootstrap.css")
def bootstrapCSS():
    return app.send_static_file("bower_components/bootstrap/dist/css/bootstrap.css")


@app.route("/js/client.js")
def clientJS():
    return app.send_static_file("js/client.js")

@app.route("/lib/jquery/jquery.js")
def jqueryJS():
    return app.send_static_file("bower_components/jquery/dist/jquery.js")

@app.route("/lib/bootstrap/js/bootstrap.js")
def bootstrapJS():
    return app.send_static_file("bower_components/bootstrap/dist/js/bootstrap.js")

# Help functions
def token_generator(size=15, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

# Main App route:
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    return render_template("index.html")


# AJAX routes
@app.route("/ajax/sign_up", methods=["POST"])
@validate_json
@validate_schema("sign_up")
def sign_up():
    try:
        data = request.get_json(silent = True)
        if db.get_user_by_email(data["email"]) != None:
            return jsonify({"error": "Email already used"}), 200
        elif db.get_user_by_username(data["username"]) != None:
            return jsonify({"error": "Username already used"}), 200
        else:
            saltedPsw = generate_password_hash(data["password"])
            if db.add(User(data["username"], saltedPsw, data["email"])):
                if GIT:
                    git.create_user(data["username"], data["password"])
                return jsonify({"success": "true", "message" : "User created"}), 200
            else:
                return jsonify({"error": "There was a error in the server"}), 200
    except:
        abort(500)

@app.route("/ajax/sign_in", methods=["POST"])
@validate_json
@validate_schema("sign_in")
def sign_in():
    try:
        data = request.get_json(silent = True)
        user = db.get_user_by_email(data["email"])
        if user == None:
            return jsonify({"error": "Email doesn't exist"}), 200
        elif not check_password_hash(user.password, data["password"]):
            return jsonify({"error": "Password is not correct"}), 200
        else:
            token = token_generator()
            db.delete_session_by_user(user.id)
            if not db.add(Session(user.id, token)):
                abort(500)
            return jsonify({"success": "true", "token" : token, "email" : user.email, "username" :  user.username}), 200
    except:
        abort(500)

@app.route("/ajax/sign_out", methods=["GET"])
@validate_token
def sign_out():
    try:
        token = request.headers["token"]
        user = db.get_user_by_token(token)
        if user == None:
            return jsonify({"error" : "The token is not correct"}), 200

        if db.delete_session_by_user(user.id) == None:
            return jsonify({"error" : "The user is not logged in"}), 200

        return jsonify({"success" : "true"}), 200
    except:
        abort(500)

@app.route("/ajax/change_password", methods=["POST"])
@validate_json
@validate_token
@validate_schema("change_password")
def change_password():
    try:
        data = request.get_json(silent = True)
        user = db.get_user_by_token(request.headers["token"])
        if user == None:
            return jsonify({"error" : "The token is not correct"}), 200

        if user.password != data["oldPass"]:
            return jsonify({"error" : "The password is not correct"}), 200

        db.change_user_password(user.id, data["newPass"])
        git.change_user_password(user.username, data["newPass"])

        return jsonify({"success" : "true"}), 200
    except:
        abort(500)

@app.route("/ajax/get_user/<username>", methods=["GET"])
def get_user_repos(username):
    try:
        current_user = None
        if 'token' in request.headers:
            token = request.headers["token"]
            if token != "undefined" and token != "null":
                current_user = db.get_user_by_token(token)
                if current_user == None:
                    return jsonify({"error" : "The token is not correct"}), 200

        user = db.get_user_by_username(username)
        if user == None:
            return jsonify({"error" : "No user with that name"})

        rlist = []
        repos = db.get_repositories_by_user(user.id)
        if repos != None:
            for r in repos:
                if not r.private:
                    rlist.append(r.name)
                elif current_user != None:
                    if db.can_user_read_repo(r.id, current_user.id):
                        rlist.append(r.name)

        return jsonify({"success" : "true", "repositories" : rlist, "email" : user.email}), 200
    except:
        abort(500)

@app.route("/ajax/get_current_user", methods=["GET"])
@validate_token
def get_current_user():
    try:
        token = request.headers["token"]
        user = db.get_user_by_token(token)
        if user == None:
            return jsonify({"error" : "The token is not correct"}), 200

        return jsonify({"success" : "true", "username" : user.username, "email" : user.email}), 200
    except:
        abort(500)

@app.route("/ajax/get_repos_shared_to", methods=["GET"])
@validate_token
def get_shared_repos():
    try:
        user = db.get_user_by_token(request.headers["token"])
        if user == None:
            return jsonify({"error" : "The token is not correct"}), 200

        repos = db.get_shared_repositories_by_user(user.id)

        return jsonify(success="true", repositories=[e.serialize(db.get_user_by_id(e.owner).username) for e in repos]), 200
    except:
        abort(500)


@app.route("/ajax/create_repository", methods=["POST"])
@validate_json
@validate_token
@validate_schema("create_repository")
def create_repository():
    try:
        data = request.get_json(silent = True)
        user = db.get_user_by_token(request.headers["token"])
        if user == None:
            return jsonify({"error" : "The token is not correct"}), 200

        if db.get_repositories_by_user_and_name(user.id, data["repoName"]) != None:
            return jsonify({"error" : "You have a repo with the same name"}), 200

        db.add(Repository(user.id, data["repoName"], data["repoDesc"], data["private"]))
        if GIT:
            git.create_repository(user.username, data["repoName"], data["private"])
        return jsonify({"success" : "true"}), 200
    except:
        abort(500)

@app.route("/ajax/get_repository_files", methods=["POST"])
@validate_json
@validate_schema("get_repository_files")
def get_repository_files():
    try:
        data = request.get_json(silent = True)
        current_user = None
        if 'token' in request.headers:
            token = request.headers["token"]
            if token != "undefined" and token != "null":
                current_user = db.get_user_by_token(token)
                if current_user == None:
                    return jsonify({"error" : "The token is not correct"}), 200

        user = db.get_user_by_username(data["owner"])
        if user == None:
            return jsonify({"error" : "The owner is not correct"}), 200

        repo = db.get_repositories_by_user_and_name(user.id, data["repoName"])
        if repo == None:
            return jsonify({"error" : "The repo doesn't exist"}), 200

        files = git.get_files_from_repo(user.username, repo.name, data["path"])

        if repo.private:
            if current_user == None:
                return jsonify({"error" : "This repository is private"}), 200
            elif not db.can_user_read_repo(repo.id, current_user.id):
                return jsonify({"error" : "You don't have access to this repository"}), 200
            else:
                return jsonify(success="true", files=[e.serialize() for e in files]), 200
        else:
            return jsonify(success="true", files=[e.serialize() for e in files]), 200
    except:
        abort(500)

@app.route("/ajax/get_file_content", methods=["POST"])
@validate_json
@validate_schema("get_file_content")
def get_file_content():
    try:
        data = request.get_json(silent = True)
        current_user = None
        if 'token' in request.headers:
            token = request.headers["token"]
            if token != "undefined" and token != "null":
                current_user = db.get_user_by_token(token)
                if current_user == None:
                    return jsonify({"error" : "The token is not correct"}), 200

        user = db.get_user_by_username(data["owner"])
        if user == None:
            return jsonify({"error" : "The owner is not correct"}), 200

        repo = db.get_repositories_by_user_and_name(user.id, data["repoName"])
        if repo == None:
            return jsonify({"error" : "The repo doesn't exist"}), 200

        fcontent = git.get_file_content(user.username, repo.name, data["path"])
        if fcontent == None:
            return jsonify({"error" : "The file doesn't exist"}), 200

        if repo.private:
            if current_user == None:
                return jsonify({"error" : "This repository is private"}), 200
            elif not db.can_user_read_repo(repo.id, current_user.id):
                return jsonify({"error" : "You don't have access to this repository"}), 200
            else:
                return jsonify({"success" : "true", "fcontent" : fcontent}), 200
        else:
            return jsonify({"success" : "true", "fcontent" : fcontent}), 200
    except:
        abort(500)

@app.route("/ajax/get_user_keys", methods=["GET"])
@validate_token
def get_user_keys():
    try:
        token = request.headers["token"]
        user = db.get_user_by_token(token)
        if user == None:
            return jsonify({"error" : "The token is not correct"}), 200

        keys = git.get_user_ssh_keys(user.username) # we don't get the entire key, not safe

        return jsonify(success="true", keys=[e.serialize() for e in keys]), 200
    except:
        abort(500)

@app.route("/ajax/add_user_key", methods=["POST"])
@validate_token
@validate_schema("add_user_key")
def add_user_key():
    try:
        data = request.get_json(silent = True)
        token = request.headers["token"]
        user = db.get_user_by_token(token)
        if user == None:
            return jsonify({"error" : "The token is not correct"}), 200

        if not git.add_user_ssh_key(user.username, data["key"]):
            return jsonify({"error" : "The key is not correct"}), 200

        return jsonify({"success" : "true", "message" : "The key was added"}), 200
    except:
        abort(500)

@app.route("/ajax/remove_user_key", methods=["POST"])
@validate_token
@validate_schema("remove_user_key")
def remove_user_key():
    try:
        data = request.get_json(silent = True)
        token = request.headers["token"]
        user = db.get_user_by_token(token)
        if user == None:
            return jsonify({"error" : "The token is not correct"}), 200

        if not git.remove_user_ssh_key(user.username, data["key"]):
            return jsonify({"error" : "The key is not correct"}), 200

        return jsonify({"success" : "true", "message" : "The key has been removed"}), 200
    except:
        abort(500)


@app.route("/ajax/get_collaborators", methods=["POST"])
@validate_schema("get_collaborators")
def get_collaborators():
    try:
        data = request.get_json(silent = True)
        owner = db.get_user_by_username(data["owner"])
        if owner == None:
            return jsonify({"error" : "The owner is not correct"}), 200

        repo = db.get_repositories_by_user_and_name(owner.id, data["repo"])
        if repo == None:
            return jsonify({"error" : "The repository doesn't exist"}), 200

        collaborators = db.get_collaborators_by_repo(repo.id)

        return jsonify(success="true", collabs=[e.serialize() for e in collaborators]), 200
    except:
        abort(500)


@app.route("/ajax/add_collaborator", methods=["POST"])
@validate_json
@validate_schema("add_collaborator")
def add_collaborator():
    try:
        data = request.get_json(silent = True)
        token = request.headers["token"]
        owner = db.get_user_by_username(data["owner"])
        user = db.get_user_by_username(data["user"])

        if owner == None:
            return jsonify({"error" : "The owner is not correct"}), 200

        if user == None:
            return jsonify({"error" : "The user does not exist"}), 200

        if user.id == owner.id:
            return jsonify({"error" : "You can't give permissions to the owner of the repository"}), 200

        current_user = db.get_user_by_token(token)
        if current_user.id != owner.id:
            return jsonify({"error" : "You are not the owner of this repository"}), 200

        repo = db.get_repositories_by_user_and_name(owner.id, data["repo"])
        if repo == None:
            return jsonify({"error" : "The repository doesn't exist"}), 200

        write = bool(data["level"] == "write")
        db.add(Collaboration(user.id, repo.id, write))
        if GIT:
            git.add_user_to_repository(owner.username, repo.name, user.username, data["level"])

        return jsonify({"success" : "true", "message" : "User added"})
    except:
        abort(500)

@app.route("/ajax/remove_collaborator", methods=["POST"])
@validate_json
@validate_schema("remove_collaborator")
def remove_collaborator():
    try:
        data = request.get_json(silent = True)
        token = request.headers["token"]
        owner = db.get_user_by_username(data["owner"])
        user = db.get_user_by_username(data["user"])

        if owner == None:
            return jsonify({"error" : "The owner is not correct"}), 200

        if user == None:
            return jsonify({"error" : "The user does not exist"}), 200

        if user.id == owner.id:
            return jsonify({"error" : "You can't take permissions from the owner of the repository"}), 200

        current_user = db.get_user_by_token(token)
        if current_user.id != owner.id:
            return jsonify({"error" : "You are not the owner of this repository"}), 200

        repo = db.get_repositories_by_user_and_name(owner.id, data["repo"])
        if repo == None:
            return jsonify({"error" : "The repository doesn't exist"}), 200

        if not db.remove_collaborator_by_repo(user.id, repo.id):
            return jsonify({"error" : "Database error"})

        if GIT:
            git.add_user_to_repository(owner.username, repo.name, user.username, "none")

        return jsonify({"success" : "true"})
    except:
        abort(500)

@app.route("/ajax/search_repository", methods=["POST"])
@validate_json
@validate_schema("search_repository")
def search_repository():
    try:
        data = request.get_json(silent = True)
        repos = db.search_repository(data["repo"])

        return jsonify(success="true", repositories=[e.serialize(db.get_user_by_id(e.owner).username) for e in repos]), 200
    except:
       abort(500)


app.run(host=ADDR, port=PORT)
