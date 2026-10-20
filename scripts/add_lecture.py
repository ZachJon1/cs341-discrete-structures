#!/usr/bin/env python3
"""Add or update a lecture entry without manually editing JSON.

Usage: python3 scripts/add_lecture.py 22 "Graph Algorithms" --topic "Graphs & Trees"
"""
import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / 'data' / 'lectures.json'


def main():
    parser = argparse.ArgumentParser(description='Add/update a CS 341 lecture in data/lectures.json')
    parser.add_argument('number', type=int, help='Lecture number')
    parser.add_argument('title', help='Lecture title')
    parser.add_argument('--topic', default='Other')
    parser.add_argument('--summary', default='')
    parser.add_argument('--notes', default='', help='Path like notes/lecture-22.pdf or HTTPS link')
    parser.add_argument('--slides', default='')
    parser.add_argument('--video', default='', help='Actual HTTPS YouTube video URL')
    args = parser.parse_args()

    if args.number < 1:
        parser.error('Lecture number must be at least 1')
    rows = json.loads(DATA_FILE.read_text(encoding='utf-8'))
    old = next((r for r in rows if r.get('number') == args.number), None)
    if old is None:
        old = {'number': args.number, 'title': '', 'topic': '', 'summary': '',
               'notes': '', 'slides': '', 'video': '', 'updated': '', 'status': 'planned'}
        rows.append(old)
    old['title'] = args.title
    old['topic'] = args.topic
    if args.summary:
        old['summary'] = args.summary
    for field in ['notes', 'slides', 'video']:
        if getattr(args, field):
            old[field] = getattr(args, field)
    old['status'] = 'published' if any(old.get(f) for f in ('notes','slides','video')) else 'planned'
    rows.sort(key=lambda item: int(item.get('number',0)))
    DATA_FILE.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f"Saved lecture {args.number}: {args.title}")
    if old.get('notes') and not old['notes'].startswith('https://') and not (ROOT / old['notes']).is_file():
        print(f"Note: {old['notes']} does not exist yet; upload the file before publishing.")


if __name__ == '__main__':
    main()
