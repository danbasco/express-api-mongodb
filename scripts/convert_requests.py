import yaml, json, sys, pathlib

src = pathlib.Path("requests/requests.yml")
dst = pathlib.Path("requests/requests.json")

data = yaml.safe_load(src.read_text())

# function to clean url objects recursively in items
def clean_item(item):
    if isinstance(item, dict):
        # clean nested request.url if exists
        if "request" in item and isinstance(item["request"], dict):
            req = item["request"]
            if "url" in req and isinstance(req["url"], dict):
                # keep only raw if present
                raw = req["url"].get("raw")
                # replace url with dict containing only raw
                if raw:
                    req["url"] = {"raw": raw}
                else:
                    # fallback: convert host+path to raw if possible
                    host = req["url"].get("host")
                    path = req["url"].get("path")
                    if host and isinstance(host, list):
                        host_part = ".".join(host)
                        path_part = "/" + "/".join(p for p in path) if path else ""
                        req["url"] = {"raw": host_part + path_part}
                    else:
                        # leave as-is
                        pass
        # recurse into nested item arrays
        for k, v in item.items():
            if isinstance(v, list):
                for it in v:
                    clean_item(it)
    return item

# top-level items
if "item" in data and isinstance(data["item"], list):
    for it in data["item"]:
        clean_item(it)

# write JSON for Postman import
dst.write_text(json.dumps(data, indent=2))
print(f"Wrote {dst.resolve()}")