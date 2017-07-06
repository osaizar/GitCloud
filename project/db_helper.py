from database import db_session
from sqlalchemy import and_, or_
from models import User, Repository, Collaboration, Session

def add(data):
    try:
        db_session.add(data)
        db_session.commit()
        return True
    except:
        return False

def get_user_by_id(userId):
    try:
        return User.query.filter(User.id == userId).one()
    except:
        return None

def get_user_by_email(email):
    try:
        return User.query.filter(User.email == email).first()
    except:
        return None

def get_user_by_username(username):
    try:
        return User.query.filter(User.username == username).first()
    except:
        return None

def get_repository_by_id(repoId):
    try:
        return Repository.query.filter(Repository.id == repoId).one()
    except:
        return None

def get_repositories_by_user(userId):
    try:
        return Repository.query.filter(Repository.owner == userId).all()
    except:
        return None

def get_repositories_by_user_and_name(userId, reponame):
    try:
        return Repository.query.filter(and_(Repository.owner == userId, Repository.name == reponame)).one()
    except:
        return None

def get_user_by_token(token):
    try:
        session = Session.query.filter(Session.token == token).one()
        return get_user_by_id(session.user)
    except:
        return None

def delete_session_by_user(userId):
    try:
        Session.query.filter(Session.user == userId).delete()
        db_session.commit()
        return True
    except:
        return None

def can_user_read_repo(repoId, userId):
    repo = get_repository_by_id(repoId)
    if repo.owner == userId:
        return True
    try:
        collab = Collaboration.query.filter(and_(Collaboration.repository == repoId, Collaboration.user == userId)).one()
        return True
    except:
        return False

def get_shared_repositories_by_user(userId):
    try:
        collabs = Collaboration.query.filter(Collaboration.user == userId).all()
        repos = []
        for c in collabs:
            repos.append(get_repository_by_id(c.repository))

        return repos

    except:
        return None

def get_collaborators_by_repo(repoId):
    try:
        return Collaboration.query.filter(Collaboration.repository == repoId).all()
    except:
        return None

def remove_collaborator_by_repo(userId, repoId):
    try:
        collab = Collaboration.query.filter(and_(Collaboration.repository == repoId, Collaboration.user == userId)).one()
        Collaboration.query.filter(Collaboration.id == collab.id).delete()
        db_session.commit()
        return True
    except:
        return False

def change_user_password(userId, password):
    user = User.query.filter(User.id == userId).one()
    user.password = password
    db_session.commit()

def search_repository(repoName):
    repos = Repository.query.filter(Repository.name.like("%"+repoName+"%")).all()
    ret = []

    for r in repos:
        if not r.private:
            ret.append(r)

    return ret
