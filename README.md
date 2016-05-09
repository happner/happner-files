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

An upload to /happner-files/files**/match/url/path**/filename<br/>
will be stored at **/store/here**/filename.

An upload to /happner-files/files__**/**__kept/deeper/path/filename<br/>
will be stored at **/var/www**/kept/deeper/path/filename.

