# parser-service

This microservice converts genbank, sbol, fasta, etc. to json. It converts
json back to genbank and fasta.

The actual parser is found here: https://github.com/TeselaGen/ve-sequence-parsers#jsontogenbank-same-interface-as-jsontofasta-no-async-required

## Installation and usage

install using `yarn`

run using `yarn start`

you can play around with GraphQL queries at http://0.0.0.0:3000/graphiql

you may make requests to http://0.0.0.0:3000/graphql

## Example query using python requests

An example query string for this would be
```json
query ParseSequences($file: String!, $filename: String!) {
  tojson(file: $file, filename: $filename) {
    messages
    parsedSequence {
      name
      sequence
      circular
      description
      features {
        name
        type
        id
        start
        end
        strand
      }
    }
    success
  }
}
```


An example of parsing files using python:

```

import json
import requests
import os
from glob import glob
from tqdm import tqdm

def test_generate_subjects(here):

    def parse_to_json(file, filename):
        url = 'http://0.0.0.0:3000/graphql'
        variables = {
            "file": file,
            "filename": filename
        }
        payload = {"query": query, "variables": variables}
        headers = {'content-type': 'application/json'}
        return requests.post(url, data=json.dumps(payload), headers=headers)


    # generate templates
    directory = os.path.join(here, "data/test_data/templates")

    sequences = []
    for path in tqdm(glob(os.path.join(directory, "*.gb"))):
        with open(path, 'r') as f:
            res = parse_to_json(f.read(), os.path.basename(path))
            sequences.append(res.json())

    sequences_json = [seq["data"]["tojson"]["parsedSequence"] for seq in sequences]
    with open(os.path.join(here, "data/test_data/templates.json"), 'w') as f:
        json.dump(sequences_json, f)

```

## Docker service