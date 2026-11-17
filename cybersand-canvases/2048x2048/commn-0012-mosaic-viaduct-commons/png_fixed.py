"""Deterministic indexed PNG writer using RFC1951 fixed-Huffman DEFLATE.
Pixels are exact CyberSand material IDs; palette is native catalogue RGB.
No image library's version-dependent PNG compression options involved.
"""
import struct
import zlib

_LB=(3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258)
_LE=(0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0)

def _reverse(c,n):
    r=0
    while n:
        r=(r<<1)|(c&1)
        c>>=1
        n-=1
    return r

def _fixed_deflate(raw):
    bits=bytearray()
    acc=0
    count=0
    def put(v,n):
        nonlocal acc,count
        acc|=(v&((1<<n)-1))<<count
        count+=n
        while count>=8:
            bits.append(acc&255)
            acc>>=8
            count-=8
    def lit(v):
        if v<=143: c,n=0x30+v,8
        elif v<=255: c,n=0x190+v-144,9
        elif v<=279: c,n=v-256,7
        else: c,n=0xc0+v-280,8
        put(_reverse(c,n),n)
    put(3,3)
    i=0
    total=len(raw)
    while i<total:
        v=raw[i]
        j=i+1
        while j<total and raw[j]==v and j-i<100000:
            j+=1
        lit(v)
        left=j-i-1
        while left>=3:
            length=min(258,left)
            code=next(k for k,(base,extra) in enumerate(zip(_LB,_LE)) if base<=length<=base+(1<<extra)-1)
            lit(257+code)
            put(length-_LB[code],_LE[code])
            put(0,5)
            left-=length
        while left:
            lit(v)
            left-=1
        i=j
    lit(256)
    if count: bits.append(acc&255)
    return b'\x78\x01'+bytes(bits)+struct.pack('>I',zlib.adler32(raw))

def _chunk(kind,data):
    return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data))

def encode_indexed_png(materials,width,height,palette):
    """materials: flat bytes/np.uint8 array; palette: accepted native RGB triples."""
    pixels=bytes(materials)
    assert len(pixels)==width*height
    pal=bytearray(256*3)
    for ident,rgb in enumerate(palette):
        if ident<256:pal[ident*3:ident*3+3]=bytes(rgb[:3])
    raw=b''.join(b'\x00'+pixels[y*width:(y+1)*width] for y in range(height))
    ihdr=struct.pack('>IIBBBBB',width,height,8,3,0,0,0)
    return b'\x89PNG\r\n\x1a\n'+_chunk(b'IHDR',ihdr)+_chunk(b'PLTE',pal)+_chunk(b'IDAT',_fixed_deflate(raw))+_chunk(b'IEND',b'')
