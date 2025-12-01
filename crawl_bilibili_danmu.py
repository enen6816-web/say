import requests
import re
import xml.etree.ElementTree as ET
import time
import random

# 解析视频URL获取ep_id
def get_ep_id_from_url(url):
    match = re.search(r'ep(\d+)', url)
    if match:
        return match.group(1)
    return None

# 获取cid (Content ID)
def get_cid_from_ep(ep_id):
    try:
        url = f"https://api.bilibili.com/pgc/view/web/season?ep_id={ep_id}"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        data = response.json()
        
        # 提取当前集的cid
        for section in data['result']['episodes']:
            if str(section['ep_id']) == ep_id:
                return section['cid']
        return None
    except Exception as e:
        print(f"获取cid时出错: {e}")
        return None

# 从B站API获取弹幕
def crawl_danmu(cid, max_count=2000):
    try:
        # 首先获取弹幕的分段数
        url = f"https://comment.bilibili.com/{cid}.xml"
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers)
        response.encoding = 'utf-8'
        
        # 解析XML
        root = ET.fromstring(response.text)
        danmu_list = []
        
        # 提取所有弹幕
        for d in root.findall('.//d'):
            danmu_text = d.text
            if danmu_text and len(danmu_text.strip()) > 0:
                danmu_list.append(danmu_text.strip())
        
        # 如果弹幕数量超过max_count，随机选取max_count条
        if len(danmu_list) > max_count:
            danmu_list = random.sample(danmu_list, max_count)
        
        return danmu_list
    except Exception as e:
        print(f"爬取弹幕时出错: {e}")
        return []

# 保存弹幕到文件，格式与现有danmu.txt一致
def save_danmu_to_file(danmu_list, filename='danmu.txt'):
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            for i, danmu in enumerate(danmu_list, 1):
                f.write(f"[{i}] {danmu}\n")
        print(f"成功保存{len(danmu_list)}条弹幕到{filename}")
    except Exception as e:
        print(f"保存弹幕文件时出错: {e}")

# 主函数
def main():
    video_url = "https://www.bilibili.com/bangumi/play/ep743046/?share_source=copy_web"
    max_danmu_count = 2000
    
    print(f"开始爬取视频: {video_url}")
    
    # 获取ep_id
    ep_id = get_ep_id_from_url(video_url)
    if not ep_id:
        print("无法从URL中提取ep_id")
        return
    print(f"获取到ep_id: {ep_id}")
    
    # 获取cid
    cid = get_cid_from_ep(ep_id)
    if not cid:
        print("无法获取cid")
        return
    print(f"获取到cid: {cid}")
    
    # 爬取弹幕
    print("开始爬取弹幕...")
    danmu_list = crawl_danmu(cid, max_danmu_count)
    
    if not danmu_list:
        print("未能爬取到任何弹幕")
        return
    
    # 保存弹幕
    save_danmu_to_file(danmu_list)
    
    # 重新生成前端弹幕数据
    try:
        import subprocess
        print("正在重新生成前端弹幕数据...")
        subprocess.run(["python", "generate_danmu_data.py"], check=True)
        print("前端弹幕数据生成完成")
    except Exception as e:
        print(f"生成前端弹幕数据时出错: {e}")
    
    print("弹幕爬取任务完成!")

if __name__ == "__main__":
    main()