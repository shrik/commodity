import re
def casper_result(text):
    if(type(text) == list):
        lines = text
    else:
        lines = text.split("\n")
    result = []
    for line in lines:
        if line.startswith("Browser Spider:"):
            result.append(line.strip().replace("Browser Spider:", ""))
    return result



def extract_num(text, none=-1):
    res = re.search(r"\d+",text)
    if res:
        return int(res.group())
    else:
        return none

def extract_float(text, none=-1):
    res = re.search(r"\d+\.\d+",text)
    if res:
        return float(res.group())
    else:
        return none