## Usage

#### Run ship server:
Go to  `ship-server/config`, update `config-{env}.json`, for example: 

```json
{
	"port": 80,
	"apiSecret": "secret",
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
First you need to install `ship-cli`, just go to the ship-cli directory, run `npm link`

Then use `ship config -h serverHost -s apiSecret` to tell ship where the server is and the api secret.

`Ship` handles file version using content hash extension approach, if you are using gulp, you can use gulp-rev to rename all the files, then in your package.json, tell ship the location of your build dir and rev-manefest.json, you can find the demo project in `ship-demo`

```json
"ship": {
    "manifestPath": "build/rev-manifest.json",
    "zipRoot": "build"
 }
```


Run `ship publish` to publish the package to `ship-server`

Finally, use this kind of url to include static resources:

```
http://ship-server-host/static/packageName@~1.0.0/js/test.js
```

The package satisfies the version range will be found and the request will be redirected to the real path:

```
http://ship-server-host/static/packageName/js/test-632d8520bd.js

```

