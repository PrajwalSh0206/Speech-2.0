import speech_recognition as sr
import sys
from bs4 import BeautifulSoup  
path=".\\public\\uploads\\"+str(sys.argv[1])
harvard = sr.AudioFile(path)
r = sr.Recognizer()
with harvard as source:
    audio = r.record(source)
data=str(r.recognize_google(audio))
print(data)