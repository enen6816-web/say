// 初始化图表函数
function initCharts() {
    // 初始化词频图
    initWordFrequencyChart();
    // 初始化情感分析图
    initSentimentChart();
    // 初始化主题分析图
    initTopicChart();
}

// 初始化词频图
function initWordFrequencyChart() {
    const wordFrequencyChart = echarts.init(document.getElementById('wordFrequencyChart'));
    
    // 模拟词频数据
    const wordData = [
        { name: '青春', value: 250 },
        { name: '友情', value: 200 },
        { name: '成长', value: 180 },
        { name: '努力', value: 160 },
        { name: '梦想', value: 150 },
        { name: '感动', value: 140 },
        { name: '可爱', value: 130 },
        { name: '真实', value: 120 },
        { name: '温暖', value: 110 },
        { name: '治愈', value: 100 },
        { name: '喜欢', value: 95 },
        { name: '支持', value: 90 },
        { name: '鼓励', value: 85 },
        { name: '美好', value: 80 },
        { name: '回忆', value: 75 },
        { name: '勇气', value: 70 },
        { name: '坚持', value: 65 },
        { name: '自信', value: 60 },
        { name: '积极', value: 55 },
        { name: '希望', value: 50 }
    ];

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}'
        },
        series: [{
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            right: null,
            bottom: null,
            sizeRange: [12, 40],
            rotationRange: [-45, 45],
            rotationStep: 45,
            gridSize: 5,
            drawOutOfBound: false,
            textStyle: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: function () {
                    return 'rgb(' + [
                        Math.round(Math.random() * 100 + 100),
                        Math.round(Math.random() * 100 + 50),
                        Math.round(Math.random() * 100 + 150)
                    ].join(',') + ')';
                }
            },
            emphasis: {
                textStyle: {
                    shadowBlur: 10,
                    shadowColor: '#333'
                }
            },
            data: wordData
        }]
    };

    wordFrequencyChart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        wordFrequencyChart.resize();
    });
}

// 初始化情感分析图
function initSentimentChart() {
    const sentimentChart = echarts.init(document.getElementById('sentimentChart'));
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            textStyle: {
                color: '#ffffff'
            }
        },
        series: [
            {
                name: '情感分布',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold',
                        color: '#ffffff'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 65, name: '积极', itemStyle: { color: '#4CAF50' } },
                    { value: 20, name: '中性', itemStyle: { color: '#FFC107' } },
                    { value: 15, name: '消极', itemStyle: { color: '#F44336' } }
                ]
            }
        ]
    };

    sentimentChart.setOption(option);
    
    window.addEventListener('resize', function() {
        sentimentChart.resize();
    });
}

// 初始化主题分析图
function initTopicChart() {
    const topicChart = echarts.init(document.getElementById('topicChart'));
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                color: '#ffffff'
            }
        },
        yAxis: {
            type: 'category',
            data: ['校园生活', '人物关系', '成长经历', '梦想追求', '日常生活'],
            axisLine: {
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                color: '#ffffff'
            }
        },
        series: [
            {
                name: '主题占比',
                type: 'bar',
                data: [30, 25, 20, 15, 10],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                        { offset: 0, color: '#FF8042' },
                        { offset: 1, color: '#FFBB28' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#FFA500' },
                            { offset: 1, color: '#FFD700' }
                        ])
                    }
                }
            }
        ]
    };

    topicChart.setOption(option);
    
    window.addEventListener('resize', function() {
        topicChart.resize();
    });
}

// 初始化人物云图和交互
function initCharacterCloud() {
    const characterCloud = echarts.init(document.getElementById('characterCloud'));
    
    // 从角色资料中提取的角色名称
    const characters = [
        { name: '岩仓美津未', value: 100 },
        { name: '志摩聪介', value: 90 },
        { name: '江头美佳', value: 80 },
        { name: '村重结月', value: 75 },
        { name: '久留米诚', value: 70 },
        { name: '迎井司', value: 65 },
        { name: '山田建斗', value: 60 },
        { name: '木之本小春', value: 55 },
        { name: '兼近鸣海', value: 50 },
        { name: '高岭十贵子', value: 45 },
        { name: '风上纮人', value: 40 },
        { name: '花园樱', value: 35 },
        { name: '小直', value: 30 },
        { name: '远山文乃', value: 25 },
        { name: '西城梨梨华', value: 20 },
        { name: '福永玖里寿', value: 15 }
    ];

    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item'
        },
        series: [{
            type: 'wordCloud',
            shape: 'circle',
            left: 'center',
            top: 'center',
            width: '100%',
            height: '100%',
            sizeRange: [15, 45],
            rotationRange: [-45, 45],
            rotationStep: 45,
            gridSize: 8,
            drawOutOfBound: false,
            textStyle: {
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                color: function () {
                    return 'rgb(' + [
                        Math.round(Math.random() * 100 + 100),
                        Math.round(Math.random() * 150 + 50),
                        Math.round(Math.random() * 100 + 100)
                    ].join(',') + ')';
                },
                emphasis: {
                    focus: 'self',
                    textStyle: {
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                }
            },
            emphasis: {
                focus: 'self',
                textStyle: {
                    textShadowBlur: 10,
                    textShadowColor: '#333'
                }
            },
            data: characters
        }]
    };

    characterCloud.setOption(option);
    
    // 点击角色显示详情
    characterCloud.on('click', function(params) {
        showCharacterDetails(params.name);
    });
    
    window.addEventListener('resize', function() {
        characterCloud.resize();
    });
}

// 显示角色详情
function showCharacterDetails(characterName) {
    const detailsContainer = document.getElementById('characterDetails');
    const detailsContent = document.getElementById('characterContent');
    
    // 角色详细信息
    const characterDetails = {
        '岩仓美津未': '岩仓美津未是一位只身从石川县的偏远小镇到东京都上高中的15岁女高中生。头脑聪明，严谨好学，以第一名的成绩考入东京都内屈指可数的重点高中燕西高中。在班级中担任女班长。入学典礼时在迷路的情况下与聪介偶遇并相识，打算考上国内顶尖大学的法律专业，以第一名的成绩毕业并从政。生日是3月3日。内心丰满自信，坦率真诚。有一个长得像妈妈的妹妹和一个长得像爸爸的弟弟。纯洁的性格也会影响她周围的人事物。性格各异的人们自然而然地聚集在她身边，性格直率，总是让周围的人积极向上。',
        '志摩聪介': '志摩聪介是美津未的同班同学，担任男班长。为人爽朗亲切，总是面带笑容，但身上似乎总是围绕着一种落寞的气氛，土生土长的东京人，曾经当过童星，兴趣爱好是各种运动。生日是10月9日。家庭背景复杂的他不喜欢谈家庭关系，但很关心他五岁的弟弟。曾与美津未试着交往，意识到两者的感情有分别，对美津未有好感，但未到喜欢的情感，和美津未和平"分手"恢复朋友关系，后来发现自己是喜欢美津未。现为戏剧部成员。',
        '江头美佳': '江头美佳是美津未上高中第一个接触的女同学。起初并没有理会美津未；一开始对她采取冷淡的态度。在美津未与聪介成为好朋友后逐渐接近她；但却在KTV试图让美津未出糗（被结月识破告知美津未）。但在进一步接触志摩失败，又被对方委托训练美津未排球时，受到其正向的性格影响；从而开始面对自己的不足之处。在排球训练除了美津未也与结月和诚开始熟识；暑假前受美津未邀请参加睡衣派对，确定四人团体朋友关系。',
        '村重结月': '村重结月是美津未的同班同学，容貌端正，身材高挑，外表成熟的美人。一入学就和美津未相处融洽，在和大家一起去卡拉OK后看出美嘉想让美津未出糗的心机；特地在休息时告知美津未。唱完后主动与美津未互加Line好友，成为了她在东京的第一个女性朋友。渴望交朋友，不喜欢被孤立，但因为其亮丽的外型在过去曾被其他人保持距离感。小学三年级前在国外度过，因此英语非常流利。',
        '久留米诚': '久留米诚是美津未的同班同学，外表是俗气的丧女。由于内向的性格而感到孤立，内心经常抱怨排斥人际交流；但在与美津未的交流中开始逐渐放松僵硬的性格。当试图改变自己并加入学生会时，遇到了美津未。通过美津未认识了与自己截然相反的村重结月。起初对她有些厌恶，但后来两人互相理解并达成妥协，成为了非常亲密的朋友。',
        '迎井司': '迎井司是美津未的同学。和聪介从初中开始就是朋友。稳健安静，个性相当耿直。聪介为数不多敞开心扉的朋友之一，然而聪介格外信任迎井的原因主要是因为迎井不会打破砂锅问到底的性格，然而迎井亦认为擅长与人保持距离的聪介有些薄情。有着不擅长和异性说话的一面，虽然老是表现的对女性不在乎，但其实还是会希望有女孩子向他表白。',
        '山田建斗': '山田建斗是美津未与志摩的同学；后来成为后者朋友。积极接近异性，尤其是结月。在恋爱观上和美津未有些落差，两人也曾因此互相讨论过。对恋爱的积极度是不论对方是谁只要来向他表白就会接受的程度。高二时因为听闻到友枝评论自己很帅的缘故而开始在意对方；并和友枝越走越近，最后开始交往。',
        '木之本小春': '木之本小春是美津未的同学。第一集学美津未在头上别发夹。在学园祭剧中饰演上校的女儿艾蜜莉亚。舞蹈社的成员。有男朋友。',
        '兼近鸣海': '兼近鸣海是二年级生。戏剧社社长。外表高瘦却迟钝，看不懂他人的脸色；然而在他人失落时也会积极的希望逗笑别人。因美津未在开学时的演讲而对其很有兴趣，并想拉拢她进入戏剧社。知道志摩曾是童星，相当积极的想让他加入戏剧社，然而却遭到对方的拒绝。',
        '高岭十贵子': '高岭十贵子是二年级生。学生会会计。完美主义者，每天都循规蹈矩的生活着，日程表会以分钟为单位计划规划。在与美津未的交流过后个性变得柔和了一些，对其他人也温柔许多。在与风上竞争学生会长的投票中落选，也因此消极了一段时间，然而在兼近的鼓舞后重新整理了情绪，并放下难以消化的执著与失落。',
        '风上纮人': '风上纮人是二年级生；新任学生会长。原先隶属于足球社，亦是被大家认可的下任社长候选人，然而因脚伤的关系而放弃并退出足球社，并在之后竞选学生会长当选。在校内是知名的风云人物，相当于一年级的志摩聪介。将学生会长的头衔视为如跳板般的职位，对于这项工作也抱持着"可以在一年内退出"、"可以在老师心目中赚取印象分数"等想法。',
        '花园樱': '花园樱是美津未的班级导师。第一次执导；同事们却皆认为其乃学校里最偷懒的老师。',
        '小直': '小直是美津未的姑姑，其实是生理男性，本名为岩仓直树，平常被美津未以"小直"的昵称来称呼。在东京当设计师，让美津未在求学期间借住并成为她在东京的监护人。有一位交往中的男友。',
        '远山文乃': '远山文乃是美津未自幼儿园便形影不离的挚友。两人可以毫无保留地谈天，从琐事到恋爱话题都能频繁地通过视讯通话，并互相报告近况，是美津未在抵达东京后，除了家人之外另外会每日定期联络的挚友。',
        '西城梨梨华': '西城梨梨华是个受欢迎的模特儿。和聪介是从童星时期便认识的朋友。过去疑似因为聪介的缘故导致童星时期出现丑闻，并受到粉丝骚扰及网络霸凌所苦，此后一直想令聪介对自己内疚，并以愧疚感束缚著聪介，要求他陪伴在自己身边。',
        '福永玖里寿': '福永玖里寿是聪介认识许久的朋友。过去是名童星，但梦想成为一名公务员，并在12岁时引退。是聪介为数不多的可以敞开心扉的朋友之一，在聪介遇上烦恼时时常在第一时间找上玖里寿。'
    };
    
    // 显示角色详情
    detailsContainer.innerHTML = `
        <h3>${characterName}</h3>
        <p>${characterDetails[characterName] || '暂无详细信息'}</p>
        <button id="closeDetails" class="close-button">关闭</button>
    `;
    detailsContainer.style.display = 'block';
    
    // 添加关闭按钮事件
    document.getElementById('closeDetails').addEventListener('click', function() {
        detailsContainer.style.display = 'none';
    });
}

// 初始化聊天功能
function initChat() {
    // 聊天历史记录
    const chatHistory = [];
    // 会话ID - 用于保持对话上下文
    let sessionId = localStorage.getItem('xiaomijiang_session_id') || Math.random().toString(36).substring(2, 15);
    localStorage.setItem('xiaomijiang_session_id', sessionId);
    
    // DOM元素获取
    const openChatBtn = document.getElementById('open-chat');
    const chatContainer = document.getElementById('chat-container');
    const closeChatBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');
    const chatMessages = document.getElementById('chat-messages');

    // 打开聊天窗口
    openChatBtn.addEventListener('click', () => {
        chatContainer.classList.remove('hidden');
        setTimeout(() => {
            chatContainer.classList.add('chat-open');
        }, 10);

        // 如果是第一次打开，发送欢迎消息
        if (chatHistory.length === 0) {
            addMessage('assistant', '你好！我是小米酱，很高兴认识你！我是一个特别喜欢《跃动青春》的AI助手，有什么想聊的吗？');
        }
    });

    // 关闭聊天窗口
    closeChatBtn.addEventListener('click', () => {
        chatContainer.classList.remove('chat-open');
        setTimeout(() => {
            chatContainer.classList.add('hidden');
        }, 300);
    });

    // 添加消息到聊天窗口
    function addMessage(role, content) {
        chatHistory.push({ role, content });
        const messageEl = document.createElement('div');
        messageEl.className = role === 'user' ? 'user-message-container' : 'assistant-message-container';
        
        // 为用户和助手准备不同的头像和名称
        const avatarClass = role === 'user' ? 'user-avatar' : 'assistant-avatar';
        const avatarText = role === 'user' ? '👤' : '🤖';
        const name = role === 'user' ? '你' : '小米酱';
        
        messageEl.innerHTML = `
            <div class="${avatarClass}">
                <div class="avatar-icon">${avatarText}</div>
            </div>
            <div class="message-content">
                <div class="message-name">${name}</div>
                <div class="message-bubble">
                    <p>${content}</p>
                </div>
            </div>
        `;
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 发送消息 - 调用真实后端API
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // 添加用户消息
        addMessage('user', message);
        messageInput.value = '';

        // 显示加载状态
        const loadingEl = document.createElement('div');
        loadingEl.className = 'loading-message';
        loadingEl.innerHTML = `
            <div class="assistant-avatar">
                <div class="avatar-icon">🤖</div>
            </div>
            <div class="message-bubble">
                <p>小米酱正在思考...</p>
            </div>
        `;
        chatMessages.appendChild(loadingEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 调用后端API - 使用相对路径，适用于任何部署环境
    fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                messages: chatHistory,
                session_id: sessionId // 发送会话ID保持对话上下文
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应错误');
            }
            return response.json();
        })
        .then(data => {
            // 移除加载状态
            chatMessages.removeChild(loadingEl);
            // 添加助手回复
            addMessage('assistant', data.response);
            // 更新会话ID（如果后端返回新的）
            if (data.session_id) {
                sessionId = data.session_id;
                localStorage.setItem('xiaomijiang_session_id', sessionId);
            }
        })
        .catch(error => {
            console.error('API调用错误:', error);
            // 移除加载状态
            chatMessages.removeChild(loadingEl);
            // 显示错误消息
            addMessage('assistant', `抱歉，连接智能助手时出现错误。请确保服务器已启动，错误信息：${error.message}`);
        });
    }

    // 点击发送按钮
    sendBtn.addEventListener('click', sendMessage);

    // 按Enter键发送消息
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// 添加CSS样式用于关闭按钮
const style = document.createElement('style');
style.textContent = `
    .close-button {
        margin-top: 15px;
        padding: 8px 20px;
        background: rgba(255, 255, 255, 0.5);
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
    }
    
    .close-button:hover {
        background: rgba(255, 255, 255, 0.8);
        transform: scale(1.05);
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化所有功能
window.addEventListener('DOMContentLoaded', function() {
    // 初始化图表
    initCharts();
    
    // 初始化人物云图
    initCharacterCloud();
    
    // 初始化聊天功能
    initChat();
    
    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
