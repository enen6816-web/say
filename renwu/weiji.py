import requests
from bs4 import BeautifulSoup
import os  # 引入操作系统模块，用于处理文件路径

def get_skip_and_loafer_final_patch(url):
    """
    爬取并清洗维基百科页面数据的函数
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    print(f"开始请求目标页面: {url}")
    
    try:
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status() 
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # --- 清洗阶段 ---
        print("正在清洗角标和干扰元素...")
        for sup in soup.find_all('sup', class_='reference'):
            sup.decompose()
        for element in soup.find_all(class_=['noprint', 'mw-editsection', 'portal', 'reflist']):
            element.decompose()

        # --- 1. 寻找标题 ---
        all_h2_headers = soup.find_all('h2')
        target_header = None
        
        print(f"--- 正在寻找目标章节 ---")
        for h2 in all_h2_headers:
            header_text = h2.get_text(strip=True)
            if any(k in header_text for k in ["登场角色", "登場人物", "登场人物", "主要角色"]):
                target_header = h2
                print(f">>> 锁定目标标题: [{header_text}]")
                break
        
        if not target_header:
            print("❌ 错误：未找到目标章节。")
            return []

        # --- 2. 处理父级容器 (适配新版维基百科) ---
        current_element = target_header
        parent = target_header.parent
        
        if parent and parent.name == 'div' and 'mw-heading' in parent.get('class', []):
            current_element = parent
        
        # --- 3. 提取内容 ---
        print("开始提取内容...")
        characters_list = []
        
        next_node = current_element.next_sibling
        
        while next_node:
            # 停止条件
            if next_node.name == 'h2':
                break
            if next_node.name == 'div' and 'mw-heading2' in next_node.get('class', []):
                break
            
            # 提取有效数据
            if next_node.name in ['p', 'ul', 'ol', 'dl']:
                text = next_node.get_text(separator='\n', strip=True)
                
                lines = [line.strip() for line in text.splitlines() if line.strip()]
                clean_text = '\n'.join(lines)
                
                if clean_text:
                    characters_list.append(clean_text)
            
            next_node = next_node.next_sibling
            
        return characters_list

    except Exception as e:
        print(f"发生错误: {e}")
        return []

# --- 主程序执行部分 ---

target_url = "https://zh.wikipedia.org/zh-cn/%E8%BA%8D%E5%8B%95%E9%9D%92%E6%98%A5"
data = get_skip_and_loafer_final_patch(target_url)

if data:
    print("\n" + "="*50)
    print("✅ 抓取成功，准备保存文件...")
    print("="*50)

    # --- 核心：保存文件逻辑 ---
    
    # 1. 获取当前脚本所在的绝对目录
    # os.path.abspath(__file__) 获取当前代码文件的完整路径
    # os.path.dirname(...) 获取该路径的父目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 2. 拼接完整的文件路径
    file_name = '跃动青春_角色资料.txt'
    file_path = os.path.join(script_dir, file_name)
    
    try:
        # 3. 写入文件 (使用 utf-8 编码防止乱码)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write("《跃动青春》登场角色资料\n")
            f.write(f"来源: {target_url}\n")
            f.write("=" * 40 + "\n\n")
            
            for block in data:
                f.write(block + "\n")
                f.write("-" * 30 + "\n\n") # 每个块之间加个分隔线
        
        print(f"🎉 文件已成功保存！")
        print(f"📂 保存路径: {file_path}")
        
    except Exception as e:
        print(f"❌ 保存文件时发生错误: {e}")

else:
    print("\n未能获取数据，无法保存。")