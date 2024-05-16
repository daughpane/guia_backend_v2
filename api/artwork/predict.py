import requests
import sys
import io

## Put your own REST endpoint
url = "https://guia-endpoint.southeastasia.inference.ml.azure.com/score"
payload={}
img_file = sys.argv[1]


files=[
  ('image',('file',io.BytesIO(img_file),'application/octet-stream'))
]
headers = {
  'Authorization': 'Bearer jbv3mXKaXYSiKBADR6gI4v8qOAseSJYi'
}
response = requests.request("POST", url, headers=headers, files=files)
print(response.text)

sys.stdout.flush()