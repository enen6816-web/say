import random
import re

# 读取弹幕文件
def generate_danmu_data():
    # 读取danmu.txt文件
    with open('danmu.txt', 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # 提取弹幕内容（去除序号）
    danmu_list = []
    for line in lines:
        # 使用正则表达式提取弹幕内容（去掉开头的[数字]格式）
        match = re.search(r'\[\d+\]\s*(.*)', line)
        if match:
            danmu_list.append(match.group(1).strip())
    
    # 随机选取50条弹幕
    selected_danmu = random.sample(danmu_list, min(50, len(danmu_list)))
    
    # 生成JavaScript数据文件
    with open('static/danmu_data.js', 'w', encoding='utf-8') as f:
        f.write('// 弹幕数据\n')
        f.write('window.danmuData = {\n')
        f.write('  danmus: [\n')
        for i, danmu in enumerate(selected_danmu):
            # 处理字符串中的引号，避免JSON解析错误
            escaped_danmu = danmu.replace('\\', '\\\\').replace('"', '\\"')
            if i < len(selected_danmu) - 1:
                f.write(f'    "{escaped_danmu}",\n')
            else:
                f.write(f'    "{escaped_danmu}"\n')
        f.write('  ]\n')
        f.write('};\n')
    
    print(f'已成功生成50条弹幕数据到static/danmu_data.js')
    return selected_danmu

if __name__ == "__main__":
    generate_danmu_data()