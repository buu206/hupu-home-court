import subprocess, concurrent.futures, pathlib, json
root=pathlib.Path(__file__).resolve().parents[1]
items=[{"file":"assets/photos/mia.jpg","url":"https://static.foxnews.com/foxnews.com/content/uploads/2023/05/Jimmy-Butler.jpg"},{"file":"assets/photos/den.jpg","url":"https://media.dunkest.com/2025/05/16172450/USATSI_26139945-scaled-e1747409155176.jpg"},{"file":"assets/photos/tor.jpg","url":"https://cdn.bebasket.fr/resources/images/blog/usatsi-28189107-168418670-lowres-1-1f105828-ae89-63b0-8de0-abbaa4d5c812.jpeg"}]
items += [{'file':f'assets/partners/{name}.svg','url':f'https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/{name}.svg'} for name in ['nike','adidas','puma','underarmour','jordan','newbalance','espn','redbull','sony','samsung','xiaomi','playstation','spotify','bilibili','beats','logitech','gopro','twitch']]
def get(i):
 p=root/i['file'];p.parent.mkdir(parents=True,exist_ok=True)
 r=subprocess.run(['curl','-sS','--fail','-L','--max-time','25','-o',str(p),i['url']],capture_output=True,text=True)
 return {'file':i['file'],'ok':r.returncode==0,'size':p.stat().st_size if p.exists() else 0}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
 for r in pool.map(get,items):print(json.dumps(r),flush=True)
