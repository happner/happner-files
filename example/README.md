## Examples

```back
cd example
```

### server-insecure

```bash
./server-insecure
```

Post upload
```bash
curl -X POST --data-binary @../LICENSE http://localhost:8080/happner-files/files/uploaded/LICENSE

# proof of upload
cat files/uploaded/LICENSE
```

Get download
```bash
curl http://localhost:8080/happner-files/files/uploaded/LICENSE > downloads/LICENSE

# proof of download
cat downloads/LICENSE
```

### server-secure

```bash
./server-secure
```

Browse to [http://127.0.0.1:8080](http://127.0.0.1:8080)

Uploaded files are saved into `files/oem1` and `files/oem2`.

