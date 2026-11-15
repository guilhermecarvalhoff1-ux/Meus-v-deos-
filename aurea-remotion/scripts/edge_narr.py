import asyncio, json, os, sys, edge_tts
text_file, out_mp3, out_words = sys.argv[1:4]
text = open(text_file).read().replace('\n', ' ')
async def main():
    c = edge_tts.Communicate(text, "pt-BR-AntonioNeural", rate="-5%", pitch="-8Hz", proxy=os.environ.get("HTTPS_PROXY"), boundary="WordBoundary")
    words = []
    with open(out_mp3, "wb") as f:
        async for ch in c.stream():
            if ch["type"] == "audio": f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                s = ch["offset"] / 1e7; d = ch["duration"] / 1e7
                words.append({"text": ch["text"], "type": "word", "start": round(s, 3), "end": round(s + d, 3)})
    json.dump({"words": words}, open(out_words, "w"), ensure_ascii=False)
    print(len(words), "palavras")
asyncio.run(main())
