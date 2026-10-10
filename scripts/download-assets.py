"""Download the source manifest and vendor assets for this local class project."""
import json, subprocess, concurrent.futures, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parents[1]
items = json.loads((ROOT/'assets/sources.json').read_text())
teams = {'lal':1610612747,'gsw':1610612744,'bos':1610612738,'chi':1610612741,'dal':1610612742,'mia':1610612748,'mil':1610612749,'phx':1610612756,'den':1610612743,'nyk':1610612752,'phi':1610612755,'mem':1610612763,'sas':1610612759,'okc':1610612760,'cle':1610612739,'tor':1610612761}
items += [{'file':f'assets/teams/{key}.svg','url':f'https://cdn.nba.com/logos/nba/{id}/primary/L/logo.svg'} for key,id in teams.items()]
items += [{'file':'assets/nba.svg','url':'https://cdn.nba.com/logos/leagues/logo-nba.svg'}]
font_css = pathlib.Path('/tmp/hupu-fonts.css').read_text()
items += [{'file':f'assets/fonts/{name}.ttf','url':url} for name,url in zip(['anton','barlow-600','barlow-700','bodoni-italic'],re.findall(r'url\((.*?)\)',font_css))]
def download(item):
    path = ROOT/item['file']; path.parent.mkdir(parents=True,exist_ok=True)
    result = subprocess.run(['curl','--fail','-sS','-L','--retry','1','--max-time','40','-o',str(path),item['url']],capture_output=True,text=True)
    return {'file':item['file'],'ok':result.returncode==0,'bytes':path.stat().st_size if path.exists() else 0,'error':result.stderr[:120]}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    for result in pool.map(download,items): print(json.dumps(result),flush=True)
