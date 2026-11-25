"""Manual IndexNow submissions for Legend Mod. No external dependencies or CI."""
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit, urljoin
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
import xml.etree.ElementTree as ET

HOST = "www.legendmod.ml"
BASE = "https://" + HOST + "/"
KEY = "7e0ef7e8e761e41f6d831e9753b3286c"
KEY_URL = BASE + KEY + ".txt"
ENDPOINT = "https://api.indexnow.org/indexnow"
ROOT = Path(__file__).resolve().parents[1]

def fetch(url):
    with urlopen(Request(url, headers={"User-Agent": "LegendMod-IndexNow/1.0"}), timeout=20) as response:
        if urlsplit(response.geturl()).hostname != HOST:
            raise ValueError("Unexpected redirect: " + response.geturl())
        return response.read()

def sitemap_urls(data):
    return [e.text.strip() for e in ET.fromstring(data).findall(".//{*}loc") if e.text]

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("urls", nargs="*", help="Changed or deleted URLs, or paths on the canonical host")
    parser.add_argument("--all", action="store_true", help="Submit the published sitemap once for initial setup")
    parser.add_argument("--dry-run", action="store_true", help="Preview without contacting IndexNow")
    args = parser.parse_args()
    if args.all == bool(args.urls):
        parser.error("Choose --all or provide one or more changed URL paths")
    try:
        if args.all:
            data = (ROOT / "sitemap.xml").read_bytes() if args.dry_run else fetch(BASE + "sitemap.xml")
            urls = sitemap_urls(data)
        else:
            urls = [urljoin(BASE, path) for path in args.urls]
        urls = list(dict.fromkeys(urls))
        for url in urls:
            p = urlsplit(url)
            if p.scheme != "https" or p.netloc != HOST or p.fragment:
                raise ValueError("Invalid canonical URL: " + url)
        if not 1 <= len(urls) <= 10000:
            raise ValueError("Expected 1 to 10,000 unique URLs")
        print(f"{len(urls)} URLs for {HOST}")
        if args.dry_run:
            print("\n".join(urls))
            print("Dry run only; no submission sent.")
            return 0
        if fetch(KEY_URL).decode("utf-8").strip() != KEY:
            raise ValueError("Published ownership key does not match")
        payload = json.dumps({"host": HOST, "key": KEY, "urlList": urls}).encode("utf-8")
        req = Request(ENDPOINT, data=payload, headers={"Content-Type": "application/json; charset=utf-8", "User-Agent": "LegendMod-IndexNow/1.0"}, method="POST")
        with urlopen(req, timeout=30) as response:
            status = response.status
        if status == 200:
            print("HTTP 200: URLs received successfully; indexing is not guaranteed.")
        elif status == 202:
            print("HTTP 202: URLs received; key validation pending.")
        else:
            print(f"HTTP {status}: unexpected response; inspect before resubmitting.")
            return 1
        return 0
    except HTTPError as e:
        print(f"HTTP {e.code}: {e.reason}. No automatic retries.")
        return 1
    except (URLError, ValueError, OSError, ET.ParseError) as e:
        print(f"Stopped: {e}. No automatic retries.")
        return 1

if __name__ == "__main__":
    raise SystemExit(main())
