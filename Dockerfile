FROM ubuntu:16.04
RUN apt-get update -y
RUN apt-get install python python-pip git wget nodejs-legacy openssh-server acl -y
RUN wget -qO- https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install nodejs -y

RUN mkdir /var/run/sshd
RUN echo 'root:toor' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

ADD . /home/GitCloud
WORKDIR /home/GitCloud

RUN service ssh restart

RUN npm install
RUN npm install bower -g
RUN pip install -r requirements.txt
RUN bower install --allow-root
RUN python project/init.py


CMD /usr/sbin/sshd -D & npm start
