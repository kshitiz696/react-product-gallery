<!-- Steps to run using the docker -->

### Build the Docker image
```bash
docker build -t react-product-gallery:latest .
```

### Pull the Docker image (if pushed to a registry)
```bash
docker pull react-product-gallery:latest
```


### Run the container
```bash
docker run -p 3000:3000 --name react-product-gallery react-product-gallery
```

### View logs (optional)
```bash
docker logs -f react-product-gallery
```

### Stop the container (optional)
```bash
docker stop react-product-gallery
```

### Remove the container (optional)
```bash
docker rm react-product-gallery
```

