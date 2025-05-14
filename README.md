

# JSON Feed Server

JSON Feed Server is an experimental project to create a feed server that uses JSON rather than a format like ATOM or RSS.

**Update May 14, 2025:** Over a decade has passed with no updates - until today. I decided to update this project as follows:

- Latest Node v22 support
- Written in TypeScript versus JavaScript
- Using Prisma and SQLite versus Mongoose and MongoDB
- Added eslint
- Found a couple bugs and I fixed those
  
**Note:** This project is just a fun experiment. Please assume there is no security, many edge cases, lack of best practices, etc. This project I run as test a backend for testing other servies.

To get started using JSON Feed Server on OS X or Linux make sure to install [Nodejs](http://nodejs.org) v22 and clone this repo and go into the folder containing the project. Next, run the following command from a command prompt to install:

```
npm i
```

Once that is completed you can have Prisma generate the files it requires and the SQLite DB:

```
npx prisma migrate dev --name init
```

Now you can run it:

```
npm run start
```

With the JSON Feed Server up and running you can now POST JSON to the server. You can use cURL, Postman or any other tool you want. Make sure to the set the `content-type` as `application/json` in the headers. Then POST some valid JSON like below into the body:

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

If JSON Feed Server is running on localhost then you can do an `HTTP POST` to:

```
http://localhost/myfeed/
```

Then you can get the contents of the feed back by doing an `HTTP GET`:

```
http://localhost/myfeed/
```

You can create as many feed routes as you want.

Once you get a few more entries inserted you will see that they come back in ascending order based on the `entryDate` date value.

```
[
  {
    "id": "30b4acd5-4d7d-4d5d-98ad-4e4f56c292e6",
    "body": {
      "body": {
        "content": "Server 184 has reported it is rebooting",
        "event": {
          "type": "System Alert"
        },
        "updated": "2012-02-19T07:40:00Z",
        "title": "Incoming Message"
      }
    },
    "feed": "myfeed",
    "selfHref": "http://localhost:8080/myfeed?=30b4acd5-4d7d-4d5d-98ad-4e4f56c292e6",
    "entryDate": "2025-05-14T20:39:40.010Z"
  },
  {
    "id": "1d619d58-51e4-4369-bb3b-1a1ee72eda24",
    "body": {
      "body": {
        "content": "Server 200 has reported it has crashed",
        "event": {
          "type": "CPU Alert"
        },
        "updated": "2025-02-19T07:40:00Z",
        "title": "Incoming Message"
      }
    },
    "feed": "myfeed",
    "selfHref": "http://localhost:8080/myfeed?=1d619d58-51e4-4369-bb3b-1a1ee72eda24",
    "entryDate": "2025-05-14T22:13:06.794Z"
  },
  {
    "id": "2ccd920c-3143-4a12-bb41-c913116df386",
    "body": {
      "body": {
        "content": "Server 402 has gone offline",
        "event": {
          "type": "Network Alert"
        },
        "updated": "2025-02-18T07:43:00Z",
        "title": "Incoming Message"
      }
    },
    "feed": "myfeed",
    "selfHref": "http://localhost:8080/myfeed?=2ccd920c-3143-4a12-bb41-c913116df386",
    "entryDate": "2025-05-14T22:14:47.930Z"
  },
  {
    "id": "57123524-f669-4526-a488-e1ebffbfdbc2",
    "body": {
      "body": {
        "content": "Server 1042 has reported it is operational",
        "event": {
          "type": "System Alert"
        },
        "updated": "2025-01-10T23:22:02Z",
        "title": "Incoming Message"
      }
    },
    "feed": "myfeed",
    "selfHref": "http://localhost:8080/myfeed?=57123524-f669-4526-a488-e1ebffbfdbc2",
    "entryDate": "2025-05-14T22:31:48.886Z"
  },
  {
    "id": "cc2f83bb-f176-458c-a0bf-bb2999e100a9",
    "body": {
      "body": {
        "content": "Server 80 has reported it is out of memory",
        "event": {
          "type": "System Alert"
        },
        "updated": "2012-02-19T05:16:00Z",
        "title": "Incoming Message"
      }
    },
    "feed": "myfeed",
    "selfHref": "http://localhost:8080/myfeed?=cc2f83bb-f176-458c-a0bf-bb2999e100a9",
    "entryDate": "2025-05-14T22:42:43.682Z"
  }
]
```

There is a `selfHref` that links you back to an individual entry as well as the date `entryDate` the entry was inserted. The original JSON POSTed to the server is stored in the `body` field. Finally, a uuid identifying the entry is generated and returned as well.

Once the feed gets large enough you can page through it using the `skip` and `limit` parameters on the querystring:

```
http://localhost:8080/feed?skip=0&limit=25
```

Skip=0 will start you at the beginning of the feed. This is just the same as calling the feed without the `skip` parameter. To skip over the first 25 entries and to limit the result to 25 entries per request do this:

```
http://localhost:8080/feed?skip=25&limit=25
```

From here you might want to grab the next 25 entries so you can do this to page:

```
http://localhost:8080/feed?skip=50&limit=25
```

You can see that we skipped the first 50 entries and then went on to grab the next 25.
