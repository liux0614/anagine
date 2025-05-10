# Anagine

### nvm, node and npm versions
```
nvm 0.40.1
node v22.14.0
npm 10.9.2
```

[![npm (scoped)](https://img.shields.io/npm/v/@gen3/guppy?label=NPM%20Release%20%28Component%29)](https://www.npmjs.com/package/@gen3/guppy)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/uc-cdis/guppy?label=GH%20Release%20%28Server%29)](https://github.com/uc-cdis/guppy/releases)


Run `npm start` to start server at port 80.

### Local Deployment and Development:


### Quickstart with Helm
You can now deploy individual services via Helm!
Please refer to the Helm quickstart guide HERE (https://github.com/uc-cdis/guppy/blob/master/doc/quickstart_helm.md)

### Configurations:
Before launch, we need to write config and tell Guppy which elasticsearch indices and which auth control field to use.
You could put following as your config files:

```
TODO
```

Following script will start server using at port 3000, using config file `example_config.json`:

```
export ANAGINE_PORT=3000
export ANAGINE_CONFIG_FILEPATH=./example_config.json
npm start
```

### Authorization:
Guppy connects Arborist for authorization.
The `auth_filter_field` item in your config file is the field used for authorization.
You could set the endpoint by:

```
export GEN3_ARBORIST_ENDPOINT=${arborist_service}
```

If not set, it would default to `http://arborist-service`. You could set it to `mock` to
skip all authorization steps. But if you just want to mock your own authorization
behavior for local test without Arborist, just set `INTERNAL_LOCAL_TEST=true`. Please
look into `/src/server/auth/utils.js` for more details.

The following script will start a Guppy server with a site-wide `regular` tier access level, and minimum visible count set to 100:

```
export TIER_ACCESS_LEVEL=regular
export TIER_ACCESS_LIMIT=100
npm start
```

### Additional Guppy Endpoints:
Guppy has a special endpoint `/download` for just fetching raw data from elasticsearch. This endpoint can be used to overcome Elastic Search's 10k record limit. Please see [here](https://github.com/uc-cdis/guppy/blob/master/doc/download.md) for details.

Guppy's `/_status` endpoint yields health check and array field information. This endpoint is publicly accessible and returns output of the form
```
{"statusCode":200,"warnings":null,"indices":{"<index-name>":{"aliases":{"alias-name":{}},"arrayFields":["<name-of-array-field>"]}}}
```

The `/_version` endpoint yields version and commit information. This endpoint is publicly accessible and returns output of the form
```
{"version":"<version-string>","commit":"<commit-hash>"}
```


### Ollama endpoint for Large Language Model (LLM)
Download Ollama from ollama.com/download

Download the LLM weights via 
```
ollama pull llama3.2:1b
```

Run LLM as endpoint via
```
ollama run llama3.2:1b
```

The LLM is served at localhost:11434