import sys
from PIL import Image
from pytesseract import pytesseract

from pdf2image import convert_from_path
path=".\\public\\uploads\\"+str(sys.argv[1])

images = convert_from_path(path)

imgPath=[]

for i in range(len(images)):
   
      # Save pages as images in the pdf
    imgPath.append('./public/images/page'+ str(i) +'.jpg')
    images[i].save(imgPath[i], 'JPEG')

path_to_tesseract = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
pytesseract.tesseract_cmd = path_to_tesseract

extracted_text_lst = []

for i in imgPath:
  image_path = i
  img = Image.open(image_path)
  text = pytesseract.image_to_string(img)
  extracted_text_lst.append(text[:-1])

print(extracted_text_lst)  