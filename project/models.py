from sqlalchemy import Column, ForeignKey, Integer, String, Boolean
from database import Base

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    username = Column(String(250), nullable=False)
    password = Column(String(250), nullable=False)
    email = Column(String(250), nullable=False)

    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email

class Repository(Base):
    __tablename__ = "repository"
    id = Column(Integer, primary_key=True)
    owner = Column(Integer, ForeignKey("user.id"))
    name = Column(String(250), nullable=False)
    desc = Column(String(1000), nullable=False)
    private = Column(Boolean, nullable=False)
    # path ?
    # file table ?

    def __init__(self, owner, name, desc="", private=False):
        self.owner = owner
        self.name = name
        self.desc = desc
        self.private = private

    def serialize(self, owner_name):
        return {
        "name" : self.name,
        "owner" : owner_name
        }

class Collaboration(Base):
    __tablename__ = "collaboration"
    id = Column(Integer, primary_key=True)
    user = Column(Integer, ForeignKey("user.id"))
    repository = Column(Integer, ForeignKey("repository.id"))
    write = Column(Boolean, nullable=False)
    # write = False, only read

    def __init__(self, user, repository, write=False):
        self.user = user
        self.repository = repository
        self.write = write

    def serialize(self):
        level = "read"
        if self.write:
            level = "write"
        return {
        "username" : User.query.filter(User.id == self.user).one().username,
        "level" : level
        }

class Session(Base):
    __tablename__ = "session"
    user = Column(Integer, ForeignKey("user.id"), primary_key=True)
    token = Column(String(20), nullable=False)

    def __init__(self, user, token):
        self.user = user
        self.token = token

# Not database classes

class GitFile():
    def __init__(self, type, name):
        self.type = type
        self.name = name

    def serialize(self):
        return {
        'type' : self.type,
        'name' : self.name
        }

class SSHKey():
    def __init__(self, name, hash):
        self.name = name
        self.hash = hash

    def serialize(self):
        return {
         'name' : self.name,
         'hash' : self.hash
        }
