from PIL import Image
import numpy as np

# 打开图片
input_path = 'static/figure1.jpg'
output_path = 'static/figure1_transparent.png'

# 加载图片
img = Image.open(input_path)
# 转换为RGBA模式以支持透明度
img = img.convert('RGBA')

# 获取像素数据
pixels = np.array(img)

# 定义纯白色阈值（只移除接近255,255,255的像素）
# 较高的阈值可以保留肤色的暖白色
white_threshold = 240

# 创建透明度掩码：将纯白色区域设为透明（alpha=0），其他区域保持不透明（alpha=255）
alpha_channel = np.where(
    (pixels[:, :, 0] > white_threshold) & 
    (pixels[:, :, 1] > white_threshold) & 
    (pixels[:, :, 2] > white_threshold),
    0, 255
)

# 应用透明度掩码
pixels[:, :, 3] = alpha_channel

# 创建新图片
result_img = Image.fromarray(pixels, 'RGBA')

# 保存结果
result_img.save(output_path)
print(f"处理完成！透明背景图片已保存到：{output_path}")