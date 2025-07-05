##  Event Manager ##
This is an event manager web application built with Node.js, Express, EJS, and SQLite. It is built for one organizer and the default organization is Fractals of Sound, a collective of musicians creating sound bath experiences rooted in world music.

#### Installation Requirements ####

* **NodeJS** 
    - Javascript engine for building webservers
    - follow the install instructions at https://nodejs.org/en/
    - we recommend using the latest LTS version
* **ExpressJS**
    - framework for simplifying building a web server
    - follow the install instructions at https://expressjs.com/en/starter/installing.html
    - we recommend using ^4.18.2
* **SQLite3** 
    - query your data tier from within your express app
    - follow the instructions at https://www.tutorialspoint.com/sqlite/sqlite_installation.htm
    - we recommend using ^5.1.2
    - Note that the latest versions of the Mac OS and Linux come with SQLite pre-installed
* **EJS**
    - Embedded Javascript templates for dynamic rendering of html
    - follow the installation instructions at https://ejs.co/
    - we recommend using ^3.1.8
* **Express-Session**
    - presistent and secure storage of user details when they are logged in
    - follow the installation instructions at https://www.npmjs.com/package/express-session
    - we recommend using ^1.18.1
* **Date-FNS**
    - date/time formatting tool
    - follow the installation instructions at https://date-fns.org/docs/Getting-Started#installation
    - we recommend using ^4.1.0
* **Bootstrap**
    - CSS library
    - follow the installation instructions under npm at https://getbootstrap.com/docs/5.0/getting-started/download/
    - we recommend using ^5.3.7

#### Teck Stack ####
* **Backend**: Node.js and Express
* **Frontend**: EJS and Bootstrap 
* **Database**: SQLite and SQLite3


#### Setup Instructions ####

To get started:

* Run ```npm install``` from the project directory to install all the node packages.

* Run ```npm run build-db``` to create the database on Mac or Linux 
or run ```npm run build-db-win``` to create the database on Windows

* Run ```npm run start``` to start serving the web app (Access via http://localhost:3000)

Test the app by browsing to the following route:

* http://localhost:3000

#### Database Management ####

SQLite uses a database file at ./database.db. All database tables are created via the db_schema.sql script. This allows you to review and recreate the database by running ```npm run build-db```

The following are some scripts for deleting the database.

```npm run clean-db``` to delete the database on Mac or Linux before rebuilding it for a fresh start
```npm run clean-db-win``` to delete the database on Windows before rebuilding it for a fresh start

#### License ####
This project is licensed under the [MIT License]

Copyright (c) 2025 Allen Pan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

#### Preparing for submission ####

Make a copy of your project folder.
In your copy, delete the following files and folders:
* node_modules
* .git (the hidden folder with your git repository)
* database.db (your database)

Make sure that your ``package.json`` file includes all of the dependencies for your project. NB. you need to use the ```--save``` tag each time you use npm to install a dependency

Edit this README.md to explain any specific instructions for setting up or using your application that you want to bring to our attention:

* remove the existing contents that we have provided
* include any settings that should be adjusted in configuration files
* include a list of the additional libraries you are using
* anything else we need to know in order to successfully run your app


NB. we will ONLY run ```npm install```, ```npm run build-db```, and ```npm run start``` . We will NOT install additional packages to run your code and will NOT run additional build scripts. Be careful with any additional node dependencies that you use.


