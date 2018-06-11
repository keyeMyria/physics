import sys
import os
import json
# import shutil

def hash():
    print("hash.........")
    md5css = os.popen("md5sum backend/static/index.css | awk '{print $1}'").read().replace('\n','')
    os.popen("cp backend/static/index.css backend/static/"+md5css+"index.css")

    md5js = os.popen("md5sum backend/static/index.js | awk '{print $1}'").read().replace('\n','')
    os.popen("cp backend/static/index.js backend/static/"+md5js+"index.js")

    web = open("backend/templates/index.html",'r',encoding='UTF-8')
    hashWeb = web.read().replace('href="/index.css"','href="/static/'+md5css+'index.css"').replace('src="/index.js"','src="/static/'+md5js+'index.js"')
    web.close()

    web = open("backend/templates/index.html",'w',encoding='UTF-8')
    web.write(hashWeb)
    web.close()

    
    # jwt = os.popen("md5sum backend/backend | awk '{print $1}'").read().replace('\n','')
    jwt = md5js
    print("jwt",jwt)
    f = open("backend/config.json",'r',encoding='UTF-8')
    config = json.load(f)
    f.close()
    config['jwt'] = jwt
    f = open("backend/config.json",'w',encoding='UTF-8')
    json.dump(config,f)
    f.close()

if __name__ == "__main__":
    hash()