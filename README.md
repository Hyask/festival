# Festival 2.0
Festival 2.0 is an HTML5 web application that can play music files.  
It also implements a piece of subsonic api which allows subsonic client apps to connect (like android apps) !

![Webmusic screenshot](https://github.com/magne4000/magne4000.github.com/raw/master/images/festival.screen1.jpg)

[Live demo !](http://getonmyhor.se:3000/)

### Dependencies (ubuntu)
You will need at least Python 3.4

Install Flask with SQLAlchemy, and python3-imaging
```bash
sudo apt-get install python3-flask python3-sqlalchemy python3-flask-sqlalchemy python3-imaging
```
If you want to use MySQL instead of SQLite, you can also install `python3-mysql.connector`, and configure `SQLALCHEMY_DATABASE_URI` in `settings.cfg` file.

### Installation
Clone the project
```bash
git clone https://github.com/magne4000/festival.git
```

### Update
```bash
git pull
```

### Configuration
In order to configure the app, you need to create a custom `settings.cfg` file:
```bash
cp settings.sample.cfg settings.cfg
```
In the newly created file `settings.cfg`, the only value that really needs to be modified is the path where your musics are stored:
```python
SCANNER_PATH = '</path/to/your/musics/>'
```
You can also launch festival.py manually for the first time, it'll create the `settings.cfg` file and prompt for mandatory values:
```bash
python3 festival.py
```

### Standalone
You can launch Festival in standalone mode. Just launch the following command to do so:
```bash
python3 festival.py
```
Now, the webserver is running (by default on port 5000), and the scanner also runs in background.

### Apache
You can also run the webserver behing Apache (see [Flask website](http://flask.pocoo.org/docs/0.10/deploying/) for other webservers)

Install mod-wsgi:
```bash
sudo apt-get install libapache2-mod-wsgi-py3
```

Copy `wsgi/festival.wsgi` somewhere accessible by Apache, edit it and replace:
```python
festival_home='/path/to/festival'
```
by the path where you cloned festival.

Then, add this into one Apache VirtualHost
```apache
WSGIDaemonProcess festival user={user} group={user}
WSGIScriptAlias /festival {path/to/festival}/wsgi/festival.wsgi process-group=festival
<Directory {path/to/festival}>
    WSGIProcessGroup festival
    WSGIApplicationGroup festival
    Order deny,allow
    Allow from all
</Directory>
```
and replace everything between `{}` by their real values.

#### Scanner
When running through Apache, scanner process needs to be launched separatly.  
For this you can either launch it manually:
```bash
python3 scanner.py
```

Or you can create an `init.d`/`systemd` script:

##### init.d
```bash
sudo cp wsgi/festival.init.d /etc/init.d/festival
```
Then edit `/etc/init.d/festival` and replace values between `{}`.

##### systemd
```bash
sudo cp wsgi/festival.systemd /etc/systemd/system/festival.service
```
Then edit `/etc/systemd/system/festival.service` and replace values between `{}`.

### subsonic
Subsonic client apps can be plugged to Festival. You just need to add it like any other server to your app.
As it doesn't support login, if your app requires login/password, just fill credentials with random letters.

### License
MIT License

Copyright © 2014-2015 Joël Charles

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
