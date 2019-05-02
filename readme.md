

### Use this in Dockerfiles to determine if NPM install needs to re-occur


normally we can just use git caching like so:


```Dockerfile
COPY package.json .
RUN npm install     # if the package.json file has not changed, then this line's image will be re-used
COPY . .
```

But what if we pull new code via git in the image instead of outside the image? So we do:


```Dockerfile

RUN CACHEBUST 1
RUN git pull  # always re-occurs
RUN package_sha --check || ( npm install && package_sha --installed )

```

The nice thing about this technique is that the sha of the whole package.json file is not used,
only the dependencies objects in package.json are compared for equality. so if you bump the version in package.json,
but the dependencies are the same, then they won't get reinstalled.
