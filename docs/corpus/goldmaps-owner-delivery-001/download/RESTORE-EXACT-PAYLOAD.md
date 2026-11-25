# Restore the exact qualified inventory

This is the engineering fallback if the primary Actions artifact expires.
Normal owner use is download → extract → **Open GOLDMAPS.cmd**.

Download these files from this directory into one folder:

- `owner-package-acquisition.v1.json.gz`
- `owner-package-acquisition.v1.json.gz.sha256`
- `owner-package-acquisition.v1.json.sha256`
- `acquire_owner_package.py`

The deterministic gzip is **5,840,428 bytes**, SHA-256
`eb06df233879d3705a4dc5e497466ce0e2bb706e28c1285b5f57c0d81a70a3e4`. It decompresses to the exact
**8,215,440-byte** original JSON, SHA-256
`c4add1023f38415c2052cdd8bcb22db5e77b2c5335d9a116a1129e8e5f4535da`. Verify those externally supplied
identities before trusting the inventory.

Using Python 3.12's standard library, verify and decompress the exact bytes:

```sh
python -c "import gzip,hashlib,pathlib; c=pathlib.Path('owner-package-acquisition.v1.json.gz').read_bytes(); assert hashlib.sha256(c).hexdigest()=='eb06df233879d3705a4dc5e497466ce0e2bb706e28c1285b5f57c0d81a70a3e4'; b=gzip.decompress(c); assert len(b)==8215440 and hashlib.sha256(b).hexdigest()=='c4add1023f38415c2052cdd8bcb22db5e77b2c5335d9a116a1129e8e5f4535da'; pathlib.Path('owner-package-acquisition.v1.json').write_bytes(b)"
```

Acquire into a fresh destination. The helper verifies every source and file:

```sh
python acquire_owner_package.py --manifest owner-package-acquisition.v1.json --manifest-sha256 c4add1023f38415c2052cdd8bcb22db5e77b2c5335d9a116a1129e8e5f4535da --out restored-goldmaps --cache goldmaps-acquisition-cache
```

The actual hosted campaign performed this exact acquisition and validated the
complete 1,640-file result. Expected payload-manifest SHA-256:
`229d70e8e083c0eaf1750ba9fdd347cb29e8d2dd23ed1139b845f9b742da6947`. The recovered Windows folder uses the same
**Open GOLDMAPS.cmd** launcher.

No origin uses an expiring Actions artifact URL. Original generated
receipts/images are embedded with compression; runtime/source files come
from exact commit or asset identities and separately checked archive members.
Those upstream sources must remain accessible. The restored file inventory
is exact; a newly compressed ZIP need not reproduce the original compression
bytes or digest. Original inner ZIP SHA-256:
`ba3d75bf97943af4148ee4427fdfcb2c6df41ede2453c80ef69e3bd6577dfea9`.

Restoration adds no native evidence, owner approval or classification.
Frozen science, original refusals and all source/run labels remain unchanged.
