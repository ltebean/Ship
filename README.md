## Usage

#### Run ship server:
Go to  `ship-server/config`, update `config-{env}.json`, for example: 

```json
{
	"port": 80,
	"mysql": {
		"host": "localhost",
		"user": "dev",
		"password": "111111",
		"database": "Ship"
	},
	"static": {
		"root": "/data/static"
	}
}
```


then run the server by:

```bash
node index.js
```

`ship-server` will listen on the specified port and serve static files from the static.root


#### Publish static resources
First you need to install `ship-cli`

Then use `ship config -h serverHost` to tell ship where the server is.

`Ship` handles file version using content hash exension approach, if you are using gulp, you can use gulp-rev to rename all the files, then in your package.json, tell ship the location of your build dir and rev-manefest.json:

```
"ship": {
    "manifestPath": "build/rev-manifest.json",
    "zipRoot": "build"
 }
```

Run `ship publish` to publish the package to `ship-server`

Finally, use this url to include static resources:

```
http://ship-server-host/dynamic/packageName@~1.0.0/js/test.js
```

It will be redirected to the real path:

```
http://ship-server-host/packageName/js/test-632d8520bd.js

```

