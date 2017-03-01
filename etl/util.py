import re
def casper_result(text):
    lines = []
    for line in text.split("\n"):
        if line.startswith("Browser Spider:"):
            lines.append(line.replace("Browser Spider:", ""))
    return lines



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