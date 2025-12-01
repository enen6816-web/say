import os
import shutil

# 定义路径
base_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(base_dir, 'static')
picture_dir = os.path.join(base_dir, 'picture')
bg_dest = os.path.join(static_dir, 'bg.jpg')

# 创建static目录
if not os.path.exists(static_dir):
    print(f"创建static目录: {static_dir}")
    os.makedirs(static_dir)
else:
    print(f"static目录已存在: {static_dir}")

# 检查是否已有背景图片
if os.path.exists(bg_dest):
    print(f"背景图片已存在: {bg_dest}")
else:
    # 从picture目录选择一张合适的图片
    picture_files = [f for f in os.listdir(picture_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
    
    if picture_files:
        # 优先选择run.jpg，如果不存在则选择第一张图片
        if 'run.jpg' in picture_files:
            bg_source = os.path.join(picture_dir, 'run.jpg')
        else:
            bg_source = os.path.join(picture_dir, picture_files[0])
        
        print(f"复制背景图片: {bg_source} -> {bg_dest}")
        shutil.copy2(bg_source, bg_dest)
        print("背景图片设置成功!")
    else:
        print("错误: picture目录中没有找到图片文件")

print("背景设置完成!")