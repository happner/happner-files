# happner-files

Happner file server.

Currently only supports uploads.

## Configuration

In mesh config.

```javascript
  ...
  components: {
    'happner-files': {
      // define a set of url to fs mappings
      // (first match wins)
      path: {
        routes: {
          '/match/url/path': '/store/here',
          '/': '/var/www'
        }
      },
      // define the happner web route to the upload handler
      web: {
        routes: {
          // http://host.name/happner-files/files
          files: 'handler'
        }
      }
    }
  },
  ...
```

An upload POST to */happner-files/files***/match/url/path**/filename<br/>
will be stored at **/store/here**/filename,<br/>
having matched the first *path route*.

An upload POST to */happner-files/files***/**kept/deeper/path/filename<br/>
will be stored at **/var/www**/kept/deeper/path/filename,<br/>
having matched the second *path route*.
