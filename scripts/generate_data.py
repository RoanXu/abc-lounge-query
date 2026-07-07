import json
import pandas as pd
from collections import Counter

# Read overseas data from Excel
df_overseas = pd.read_excel('/mnt/agents/upload/境外机场贵宾厅列表.xlsx')
overseas_records = []
for idx, row in df_overseas.iterrows():
    record = {
        "id": f"ov_{idx}",
        "region": str(row['州']).strip() if pd.notna(row['州']) else "",
        "country": str(row['国家']).strip() if pd.notna(row['国家']) else "",
        "city": str(row['城市']).strip() if pd.notna(row['城市']) else "",
        "airportName": str(row['站点']).strip() if pd.notna(row['站点']) else "",
        "airportCode": str(row['三字码']).strip() if pd.notna(row['三字码']) else "",
        "terminal": str(row['航站楼']).strip() if pd.notna(row['航站楼']) else "",
        "loungeName": str(row['名称']).strip() if pd.notna(row['名称']) else "",
        "departureType": str(row['出发类型']).strip() if pd.notna(row['出发类型']) else "",
        "securityType": str(row['安检类型']).strip() if pd.notna(row['安检类型']) else "",
        "locationGuide": str(row['位置指引']).strip() if pd.notna(row['位置指引']) else "",
        "type": "overseas"
    }
    overseas_records.append(record)

overseas_filtered = [r for r in overseas_records if r['region'] != '中国']

# Read domestic data from new Excel
df_domestic = pd.read_excel('/mnt/agents/upload/农行信用卡境内贵宾厅.xlsx')

def process_security_type(val):
    val = val.strip() if isinstance(val, str) else ''
    return '安检后' if val == '安检内' else val

def process_departure_type(val):
    val = str(val) if pd.notna(val) else ''
    if val == 'nan' or not val or val == '国内':
        return '国内出发'
    types = []
    if '国内' in val: types.append('国内出发')
    if '国际' in val: types.append('国际出发')
    return ','.join(types) if types else '国内出发'

def process_guest_policy(val):
    val = str(val) if pd.notna(val) else ''
    if not val or val == 'nan': return '未知'
    if '不可携带随行人员' in val:
        age_match = re.search(r'(\d+)\s*岁', val)
        return f"仅可携带{age_match.group(1)}岁以下儿童" if age_match else "不可携伴"
    if '仅限本人' in val or '仅限客户本人' in val: return "不可携伴"
    if '可携带' in val:
        count_match = re.search(r'可携带\s*(\d+)\s*名', val)
        count = count_match.group(1) if count_match else ""
        return f"可携伴{count}人（扣减次数）" if '扣减' in val else (f"可携伴{count}人" if count else "可携伴")
    return val[:20]

domestic_records = []
for idx, row in df_domestic.iterrows():
    city = str(row['城市']).strip()
    terminal = str(row['航站楼']).strip() if pd.notna(row['航站楼']) else ''
    if terminal == '-': terminal = ''
    
    lounge = str(row['贵宾厅名称']).strip() if pd.notna(row['贵宾厅名称']) else ''
    location = str(row['位置指引']).strip() if pd.notna(row['位置指引']) else ''
    if not lounge and location: lounge = location[:28]
    if not lounge: lounge = '贵宾厅'
    
    domestic_records.append({
        "id": f"dm_{idx}", "region": "中国", "country": "中国", "city": city,
        "airportName": str(row['站点']).strip(),
        "airportCode": str(row['机场代码']).strip() if pd.notna(row['机场代码']) else '',
        "terminal": terminal, "loungeName": lounge,
        "departureType": process_departure_type(row['出发类型']),
        "securityType": process_security_type(str(row['安检类型']) if pd.notna(row['安检类型']) else ''),
        "locationGuide": location, "type": "domestic",
        "needsBooking": str(row['是否需要预约']).strip() if pd.notna(row['是否需要预约']) else '未知',
        "advanceBooking": "", "guestPolicy": process_guest_policy(row['能否携伴']),
    })

all_records = domestic_records + overseas_filtered
with open('/mnt/agents/output/app/public/data/lounges.json', 'w', encoding='utf-8') as f:
    json.dump(all_records, f, ensure_ascii=False, indent=2)

print(f"Total: {len(all_records)} (domestic: {len(domestic_records)}, overseas: {len(overseas_filtered)})")
