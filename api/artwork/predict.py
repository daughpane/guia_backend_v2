import requests
## Put your own REST endpoint
url = "https://guia-endpoint.southeastasia.inference.ml.azure.com/score"
payload={}
img_file = '/content/gdrive/Shareddrives/KBytes Projects/CMSC129/Guia AI/FINAL_ARTWORKS/RAW/Imperfectly Beautiful/IMG_20240311_152409.jpg'


files=[
  ('image',('file',open(img_file,'rb'),'application/octet-stream'))
]
headers = {
  'Authorization': 'Bearer jbv3mXKaXYSiKBADR6gI4v8qOAseSJYi'
}
response = requests.request("POST", url, headers=headers, files=files)
print(response.text)