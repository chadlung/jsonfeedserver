```
       __ _____  ____   _   __   ______                 __   _____                               
      / // ___/ / __ \ / | / /  / ____/___   ___   ____/ /  / ___/ ___   _____ _   __ ___   _____
 __  / / \__ \ / / / //  |/ /  / /_   / _ \ / _ \ / __  /   \__ \ / _ \ / ___/| | / // _ \ / ___/
/ /_/ / ___/ // /_/ // /|  /  / __/  /  __//  __// /_/ /   ___/ //  __// /    | |/ //  __// /    
\____/ /____/ \____//_/ |_/  /_/     \___/ \___/ \__,_/   /____/ \___//_/     |___/ \___//_/     
```

##JSON Feed Server##

JSON Feed Server is an experimental project to create a feed server that uses JSON rather than a format like ATOM or RSS.

**Note:** This project is a (fun) work in progress and lacking unit tests nor has not been extensively tested.  Feel free to contribute back!

To get started using JSON Feed Server on OS X or Linux make sure to install [Nodejs](http://nodejs.org).  Next, clone the source files from GitHub to your computer.  Go into the folder where you cloned the source files and run the following command from a command prompt to install the dependencies:

```
$ npm install
```

Once that is completed make sure you have [MongoDB](http://mongodb.org) running and the **config.js** configured to your settings.  Then, simply run the **app.js** file with Nodejs:

```
$ node app.js
```

With the JSON Feed Server up and running you can now POST JSON to the server.  You can use curl or any tool you feel familar with.  I tested with the Chrome plugin [XHR Poster](https://chrome.google.com/webstore/detail/akdbimilobjkfhgamdhneckaifceicen).  Make sure to the set the **content-type** as **application/json**.  Then insert some valid JSON like below:

```
{
    "content": "Server 184 has reported it is ready",
    "event": {
        "type": "System Alert"
    },
    "updated": "2012-02-19T07:40:00Z",
    "title": "Incoming Message"
}
```

If JSON Feed Server is running on localhost then you can do an HTTP POST to:

```
http://localhost/your/feed/here/
```

As you can see you can set your feed route(s) on the fly.  So if I use the following URL to POST some JSON to:

```
http://localhost/myfeed/
```

Then you can get the contents of the feed back by doing an HTTP GET:

```
http://localhost/myfeed/
```

You can create as many routes as you want:

```
http://localhost/myfeed/events/
http://localhost/news/
http://localhost/my/unique/feed/
```

Once you get a few more entries inserted you will see that they come back ordered by the newest entry first.

```
{
  "4f419e771c69848a02000005": {
  	"body": {
			"content": "Server 184 has reported it is rebooting", 
			"event": {
				"type": "System Alert"
			}, 
			"updated": "2012-02-19T07:40:00Z", 
			"title": "Incoming Message"
		}, 
		"selfHref": "http://localhost:8080/feed/?id=4f419e771c69848a02000005", 
		"entryDate": "2012-02-20T01:14:31.763Z"
	}, 
	"4f419aba1c1d6b7c02000005": {
		"body": {
			"content": "Server 80 has reported it is out of memory", 
			"event": {
				"type": "System Alert"
			}, 
			"updated": "2012-02-19T05:16:00Z", 
			"title": "Incoming Message"
		}, 
		"selfHref": "http://localhost:8080/feed/?id=4f419aba1c1d6b7c02000005", 
		"entryDate": "2012-02-20T00:58:34.738Z"
	}, 
	"4f41930e70c8fc1102000001": {
		"body": {
			"content": "Server 1042 has reported it is operational", 
			"event": {
				"type": "System Alert"
			}, 
			"updated": "2012-02-19T23:20:02Z", 
			"title": "Incoming Message"
		}, 
		"selfHref": "http://localhost:8080/feed/?id=4f41930e70c8fc1102000001", 
		"entryDate": "2012-02-20T00:25:50.939Z"
	}
}
```

There is a **selfHref** that links you back to an individual entry as well as the date(**entryDate**) the entry was inserted.  The original JSON POSTed to the server is stored on **body**.  Finally, a unique id identifying the entry is generated and returned as well.

Once the feed gets large enough you can page through it using the **skip** and **limit** parameters on the querystring:

```
http://localhost:8080/feed/?skip=0&limit=25
```

Skip=0 will start you at the beginning of the feed, this is just the same as calling the feed without the **skip** parameter.  To skip over the first 25 entries and to limit the result to 25 entries per request do this:

```
http://localhost:8080/feed/?skip=25&limit=25
```

From here you might want to grab the next 25 entries so you can do this to page:

```
http://localhost:8080/feed/?skip=50&limit=25
```

You can see that we skipped the first 25 entries, read the next 25 and then went on to grab the next 25.

In the response headers you will see two things of interest, first is a weak ETag:

```
ETag  W/"4f419e771c69848a02000005-4f40b6054ef78a4001000001"
```

The second is a response header that tells you how long the response took:

```
X-Response-Time  2ms
```

###Notes Regarding licensing###

*All files contained with this distribution of Atom Hopper are licenced 
under the [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0).
You must agree to the terms of this license and abide by them before
viewing, utilizing or distributing the source code contained within this distribution.*
                                                                                                 