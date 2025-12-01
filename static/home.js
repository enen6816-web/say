// 首页导航跳转逻辑和弹幕效果

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化弹幕系统
    initDanmuSystem();
    // 获取导航按钮元素
    const danmuButton = document.getElementById('go-to-danmu');
    const charactersButton = document.getElementById('go-to-characters');
    const xiaomijiangButton = document.getElementById('go-to-xiaomijiang');

    // 弹幕心声按钮点击事件
    danmuButton.addEventListener('click', function() {
        // 添加点击动画效果
        this.classList.add('clicked');
        setTimeout(() => {
            // 跳转到内容页的弹幕心声部分
            window.location.href = 'content.html#analytics';
        }, 300);
    });

    // 人物长廊按钮点击事件
    charactersButton.addEventListener('click', function() {
        // 添加点击动画效果
        this.classList.add('clicked');
        setTimeout(() => {
            // 跳转到内容页的人物长廊部分
            window.location.href = 'content.html#characters';
        }, 300);
    });

    // 小米酱智能助手按钮点击事件
    xiaomijiangButton.addEventListener('click', function() {
        // 添加点击动画效果
        this.classList.add('clicked');
        setTimeout(() => {
            // 跳转到内容页的小米酱智能助手部分
            window.location.href = 'content.html#xiaomijiang';
        }, 300);
    });

    // 添加CSS样式用于按钮点击效果
    const style = document.createElement('style');
    style.textContent = `
        .nav-button.clicked {
            animation: buttonPress 0.3s ease;
        }

        @keyframes buttonPress {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(0.95);
            }
            100% {
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);

    // 为按钮添加悬停音效（可选功能）
    const addHoverSound = function(button) {
        button.addEventListener('mouseover', function() {
            // 这里可以添加简单的音效或其他交互效果
            // 例如改变按钮颜色、大小等
            this.style.transition = 'transform 0.2s ease';
            this.style.transform = 'translateY(-5px)';
        });

        button.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
        });
    };

    // 为所有按钮添加悬停效果
    addHoverSound(danmuButton);
    addHoverSound(charactersButton);
    addHoverSound(xiaomijiangButton);
});

// 弹幕系统实现
function initDanmuSystem() {
    // 检查是否在首页且弹幕数据和容器存在
    if (!window.danmuData || !document.getElementById('danmuContainer')) {
        return;
    }
    
    const container = document.getElementById('danmuContainer');
    const containerHeight = window.innerHeight;
    const containerWidth = window.innerWidth;
    const danmuList = window.danmuData.danmus || [];
    
    // 定义弹幕轨道数量（将屏幕上半部分高度分成多条轨道）
    const upperHalfHeight = containerHeight / 2; // 只使用屏幕上半部分
    const trackCount = Math.floor(upperHalfHeight / 30); // 每条轨道高度约30px
    const activeTracks = new Array(trackCount).fill(false); // 标记轨道是否被占用
    
    // 颜色数组用于随机弹幕颜色
    const colors = [
        '#FFFFFF', '#FF6B6B', '#4ECDC4', '#45B7D1', 
        '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'
    ];
    
    // 创建单个弹幕
    function createDanmu() {
        // 随机选择一条弹幕内容
        const danmuText = danmuList[Math.floor(Math.random() * danmuList.length)];
        if (!danmuText) return;
        
        // 创建弹幕元素
        const danmuElement = document.createElement('div');
        danmuElement.className = 'danmu-item';
        danmuElement.textContent = danmuText;
        
        // 随机选择颜色
        const color = colors[Math.floor(Math.random() * colors.length)];
        danmuElement.style.color = color;
        
        // 随机选择速度（动画持续时间）
        const duration = 6000 + Math.random() * 8000; // 6-14秒
        danmuElement.style.animationDuration = `${duration}ms`;
        // 设置线性动画，避免速度变化
        danmuElement.style.animationTimingFunction = 'linear';
        
        // 随机选择透明度
        const opacity = 0.7 + Math.random() * 0.3; // 0.7-1.0
        danmuElement.style.opacity = opacity;
        
        // 计算并设置弹幕位置
        // 随机选择一条可用轨道
        let trackIndex;
        let attempts = 0;
        do {
            trackIndex = Math.floor(Math.random() * trackCount);
            attempts++;
            // 如果尝试次数过多，强制选择一条轨道
            if (attempts > trackCount * 2) {
                break;
            }
        } while (activeTracks[trackIndex]);
        
        // 标记轨道为占用
        activeTracks[trackIndex] = true;
        
        // 设置垂直位置（基于轨道）
        const topPosition = trackIndex * 30 + 10;
        danmuElement.style.top = `${topPosition}px`;
        
        // 添加弹幕到容器
        container.appendChild(danmuElement);
        
        // 监听动画结束事件
        danmuElement.addEventListener('animationend', function() {
            // 移除弹幕元素
            container.removeChild(danmuElement);
            // 释放轨道
            activeTracks[trackIndex] = false;
        });
    }
    
    // 持续创建弹幕
    function startDanmuInterval() {
        // 初始批量创建一些弹幕
        for (let i = 0; i < 10; i++) {
            setTimeout(createDanmu, i * 300);
        }
        
        // 设置定时器持续创建弹幕
        setInterval(createDanmu, 500 + Math.random() * 1000); // 0.5-1.5秒的间隔
    }
    
    // 开始弹幕
    startDanmuInterval();
    
    // 窗口大小变化时更新容器尺寸
    window.addEventListener('resize', function() {
        // 重新计算轨道
        const newTrackCount = Math.floor(window.innerHeight / 30);
        if (newTrackCount !== trackCount) {
            // 重置并重新初始化
            container.innerHTML = '';
            activeTracks.fill(false);
        }
    });
}