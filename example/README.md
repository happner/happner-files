## Examples

### server-insecure

```bash
./server-insecure
```

post upload
```bash
curl -X POST --data-binary @../LICENSE http://localhost:8080/happner-files/files/uploaded/LICENSE
```

upload proof
```bash
cat files/uploaded/LICENSE
```
