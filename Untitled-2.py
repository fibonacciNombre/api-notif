def createIndex(esClient):
 try:
  res = esClient.indices.exists('metadata-store')
  print("Index Exists ... {}".format(res))
  if res is False:
   esClient.indices.create('metadata-store', body=indexDoc)
   return 1
 except Exception as E:
  print("Unable to Create Index {0}".format("metadata-store"))
  print(E)
  exit(4)