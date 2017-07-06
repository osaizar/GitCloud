from functools import wraps
import re
from flask import (
    jsonify,
    request,
    abort,
)

MAIL_RE = "[^@]+@[^@]" # something followed by @ followed by something

def validate_json(f):
    @wraps(f)
    def wrapper(*args, **kw):
        try:
            js = request.json
            if js == None:
                raise Exception
        except:
            return jsonify({"error": "Bad request"}), 400
        return f(*args, **kw)
    return wrapper

def validate_token(f):
    @wraps(f)
    def wrapper(*args, **kw):
        try:
            if "token" not in request.headers:
                return jsonify({"error" : "No token in the header"}), 400

            token = request.headers["token"]
            if token == "undefined" or token == "null":
                return jsonify({"error" : "Not logged in"}), 400

        except:
            return jsonify({"error": "Bad request"}), 400
        return f(*args, **kw)
    return wrapper

def validate_schema(name):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kw):
            try:
                validate(request.json, name)
            except Exception, e:
                return jsonify({"error": e.message}), 400
            return f(*args, **kw)
        return wrapper
    return decorator

def validate(input, name):
    if name == "sign_up":
        validate_sign_up(input)
    elif name == "sign_in":
        validate_sign_in(input)
    elif name == "create_repository":
        validate_create_repository(input)
    elif name == "get_repository_files":
        validate_get_repository_files(input)
    elif name == "get_file_content":
        validate_get_repository_files(input)
    elif name == "change_password":
        validate_change_password(input)
    elif name == "add_user_key":
        validate_user_key(input)
    elif name == "remove_user_key":
        validate_user_key(input)
    elif name == "get_collaborators":
        validate_get_collaborators(input)
    elif name == "add_collaborator":
        validate_add_collaborator(input)
    elif name == "remove_collaborator":
        validate_remove_collaborator(input)
    else:
        Exception("no schemas with that name")

# validator functions

def validate_sign_up(input):
    try:
        email = input["email"]
        password = input["password"]
        repassword = input["rePassword"]
        username = input["username"]
    except:
        raise Exception("Invalid request")

    if not (email and password and repassword and username):
        raise Exception("Fill all fields")
    elif email.isspace() or password.isspace() or repassword.isspace() or username.isspace():
        raise Exception("You can't fill the fields with spaces!")
    elif password != repassword:
        raise Exception("Passwords do not match")
    elif len(password) < 6:
        raise Exception("Password is too short")
    elif not re.match(MAIL_RE, email):
        raise Exception("Email is not valid")
    else:
        pass # correct!

def validate_change_password(input):
    try:
        oldPass = input["oldPass"]
        newPass = input["newPass"]
        reNewPass = input["reNewPass"]
    except:
        raise Exception("Invalid request")

    if not (oldPass and newPass and reNewPass):
        raise Exception("Fill all fields")
    elif newPass.isspace():
        raise Exception("You can't fill the fields with spaces!")
    elif newPass != reNewPass:
        raise Exception("Passwords do not match")
    elif len(newPass) < 6:
        raise Exception("Password is too short")
    else:
        pass # correct!


def validate_sign_in(input):
    try:
        email = input["email"]
        password = input["password"]
    except:
        raise Exception("Invalid request")

    if not (email and password):
        raise Exception("Fill all fields")
    elif email.isspace() or password.isspace():
        raise Exception("You can't fill the fields with spaces!")
    else:
        pass #correct!

def validate_create_repository(input):
    try:
        name = input["repoName"]
        desc = input["repoDesc"]
        private = input["private"]
    except:
        raise Exception("Invalid request")

    if not (name and str(private)):
        raise Exception("Fill all fields")
    elif " " in name:
        raise Exception("Name can't include a space")
    elif str(private) != "True" and str(private) != "False":
        raise Exception("Invalid value for 'private'")
    else:
        pass # correct!

def validate_get_repository_files(input):
    try:
        path = input["path"]
        repoName = input["repoName"]
        owner = input["owner"]
    except:
        raise Exception("Invalid request")

    if not (repoName and owner):
        raise Exception("Fill all fields")
    elif repoName.isspace() or owner.isspace():
        raise Exception("The fields are not correct")
    else:
        pass # correct!

def validate_user_key(input):
    try:
        key = input["key"]
    except:
        raise Exception("Invalid request")

    if not key:
        raise Exception("Fill all fields")
    else:
        pass

def validate_get_collaborators(input):
    try:
        repo = input["repo"]
        owner = input["owner"]
    except:
        raise Exception("Invalid request")

    if not (repo and owner):
        raise Exception("Fill all fields")
    else:
        pass # correct!

def validate_add_collaborator(input):
    try:
        repo = input["repo"]
        owner = input["owner"]
        user = input["user"]
        level = input["level"]
    except:
        raise Exception("Invalid request")

    if not (repo and owner and user and level):
        raise Exception("Fill all fields")
    elif not (level == "write" or level == "read"):
        raise Exception("Level is not correct")
    else:
        pass # correct!

def validate_remove_collaborator(input):
    try:
        repo = input["repo"]
        owner = input["owner"]
        user = input["user"]

    except:
        raise Exception("Invalid request")

    if not (repo and owner and user):
        raise Exception("Fill all fields")
    else:
        pass # correct!

def validate_search_repository(input):
    try:
        repo = input["repo"]
    except:
        raise Exception("Invalid request")
    if len(repo) < 3:
        raise Exception("Repository should be 3 characters long at least")
    else:
        pass # correct!
