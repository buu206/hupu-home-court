"""Verify the required local assets without a network connection."""
from pathlib import Path
import re, json
root=Path(__file__).resolve().parents[1]
errors=[]
for file in ['index.html','styles.css']:
 text=(root/file).read_text()
 refs=re.findall(r'(?:src|href)="(assets/[^"?#]+)',text) if file.endswith('html') else re.findall(r"url\(['\"]?(assets/[^'\")]+)",text)
 for ref in refs:
  if not (root/ref).is_file(): errors.append(ref)
ids=['lal','gsw','bos','chi','mia','mil','phx','den','dal','nyk','phi','mem','sas','okc','cle','tor']
for id in ids:
 for ref in [f'assets/jerseys/{id}.jpg',f'assets/photos/{id}.jpg',f'assets/teams/{id}.svg']:
  p=root/ref
  if not p.is_file() or p.stat().st_size<100:errors.append(ref)
print(json.dumps({'teams':len(ids),'required_team_assets':len(ids)*3,'missing_or_empty':errors},ensure_ascii=False,indent=2))
raise SystemExit(bool(errors))
